<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePromoCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:50|unique:promo_codes,code',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'max_usage' => 'required|integer|min:1',
            'expires_at' => 'nullable|date|after:today',
        ];
    }
}
