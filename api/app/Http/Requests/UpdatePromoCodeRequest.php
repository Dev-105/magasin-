<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePromoCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'code' => 'sometimes|required|string|max:50|unique:promo_codes,code,' . $this->route('promo_code'),
            'discount_percentage' => 'sometimes|required|numeric|min:0|max:100',
            'max_usage' => 'sometimes|required|integer|min:1',
            'expires_at' => 'nullable|date|after:today',
        ];
    }
}
