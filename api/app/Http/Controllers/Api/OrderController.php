<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PromoCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends BaseController
{
    public function index(): JsonResponse
    {
        $orders = auth()->user()->orders()->with(['items.product.images', 'promoCode'])->latest()->paginate(10);

        return $this->success(OrderResource::collection($orders)->response()->getData(true), 'Order history retrieved');
    }

    public function show(Order $order): JsonResponse
    {
        $this->authorizeOrder($order);
        $order->load(['items.product.images', 'promoCode']);

        return $this->success(new OrderResource($order), 'Order details retrieved');
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $user = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return $this->error('Cart is empty.', null, 422);
        }

        $promoCode = null;
        if ($request->filled('promo_code')) {
            $promoCode = PromoCode::where('code', $request->promo_code)->first();

            if (! $promoCode || ! $promoCode->isValid()) {
                return $this->error('Promo code is invalid or expired.', null, 422);
            }
        }

        $total = 0;
        foreach ($cartItems as $item) {
            $product = $item->product;

            if ($item->quantity > $product->stock) {
                return $this->error("Product {$product->title} does not have enough stock.", null, 422);
            }

            $total += $product->discounted_price * $item->quantity;
        }

        if ($promoCode) {
            $total = round($total * (1 - $promoCode->discount_percentage / 100), 2);
        }

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'pending',
                'promo_code_id' => $promoCode?->id,
            ]);

            foreach ($cartItems as $item) {
                $product = $item->product;
                $unitPrice = $product->discounted_price;

                OrderItem::create([
                    'command_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => round($unitPrice * $item->quantity, 2),
                ]);

                $product->decrement('stock', $item->quantity);
            }

            if ($promoCode) {
                $promoCode->increment('used_count');
            }

            $user->cartItems()->delete();
            DB::commit();
        } catch (\Throwable $exception) {
            DB::rollBack();
            return $this->error('Unable to create order. ' . $exception->getMessage(), null, 500);
        }

        return $this->success(new OrderResource($order->load(['items.product.images', 'promoCode'])), 'Order created', 201);
    }

    protected function authorizeOrder(Order $order): void
    {
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
    }
}
