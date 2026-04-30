<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PromoCodeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'discount_percentage' => $this->discount_percentage,
            'max_usage' => $this->max_usage,
            'used_count' => $this->used_count,
            'expires_at' => $this->expires_at?->toDateTimeString(),
            'is_active' => $this->isValid(),
        ];
    }
}
