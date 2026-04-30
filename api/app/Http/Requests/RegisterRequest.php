<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:25|unique:users,phone',
            'password' => 'required|string|min:8|confirmed',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'profile_image' => 'nullable|url',
        ];
    }
}
