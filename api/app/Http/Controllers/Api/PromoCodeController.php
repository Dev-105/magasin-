<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StorePromoCodeRequest;
use App\Http\Requests\UpdatePromoCodeRequest;
use App\Http\Resources\PromoCodeResource;
use App\Models\PromoCode;
use Illuminate\Http\JsonResponse;

class PromoCodeController extends BaseController
{
    public function index(): JsonResponse
    {
        $promoCodes = PromoCode::orderByDesc('expires_at')->get();

        return $this->success(PromoCodeResource::collection($promoCodes), 'Promo codes retrieved');
    }

    public function store(StorePromoCodeRequest $request): JsonResponse
    {
        $promoCode = PromoCode::create(array_merge($request->validated(), ['used_count' => 0]));

        return $this->success(new PromoCodeResource($promoCode), 'Promo code created', 201);
    }

    public function update(UpdatePromoCodeRequest $request, PromoCode $promoCode): JsonResponse
    {
        $promoCode->update($request->validated());

        return $this->success(new PromoCodeResource($promoCode), 'Promo code updated');
    }

    public function destroy(PromoCode $promoCode): JsonResponse
    {
        $promoCode->delete();

        return $this->success(null, 'Promo code deleted', 204);
    }
}
