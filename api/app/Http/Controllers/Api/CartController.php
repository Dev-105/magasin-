<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\CartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Http\Resources\CartItemResource;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;

class CartController extends BaseController
{
    public function index(): JsonResponse
    {
        $items = auth()->user()->cartItems()->with('product.images')->get();

        return $this->success(CartItemResource::collection($items), 'Cart items retrieved');
    }

    public function store(CartItemRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $cartItem = CartItem::updateOrCreate(
            ['user_id' => $user->id, 'product_id' => $data['product_id']],
            ['quantity' => $data['quantity']]
        );

        return $this->success(new CartItemResource($cartItem->load('product.images')), 'Item added to cart', 201);
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): JsonResponse
    {
        $this->authorizeCartItem($cartItem);
        $cartItem->update($request->validated());

        return $this->success(new CartItemResource($cartItem->load('product.images')), 'Cart item updated');
    }

    public function destroy(CartItem $cartItem): JsonResponse
    {
        $this->authorizeCartItem($cartItem);
        $cartItem->delete();

        return $this->success(null, 'Cart item removed', 204);
    }

    public function clear(): JsonResponse
    {
        auth()->user()->cartItems()->delete();

        return $this->success(null, 'Cart cleared');
    }

    protected function authorizeCartItem(CartItem $cartItem): void
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
    }
}
