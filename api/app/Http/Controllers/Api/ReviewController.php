<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends BaseController
{
    public function index(Product $product): JsonResponse
    {
        $reviews = $product->reviews()->with('user')->paginate(10);

        return $this->success(ReviewResource::collection($reviews)->response()->getData(true), 'Product reviews');
    }

    public function store(StoreReviewRequest $request, Product $product): JsonResponse
    {
        $user = $request->user();

        $review = Review::updateOrCreate([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ], $request->validated());

        return $this->success(new ReviewResource($review->load('user')), 'Review saved', 201);
    }
}
