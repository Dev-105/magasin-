<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_percentage',
        'max_usage',
        'used_count',
        'expires_at',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'promo_code_id');
    }

    public function isValid(): bool
    {
        return $this->used_count < $this->max_usage && (! $this->expires_at || $this->expires_at->isFuture());
    }
}
