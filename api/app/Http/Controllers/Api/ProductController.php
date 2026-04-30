<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Like;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProductController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['images', 'tags'])
            ->withCount(['likes', 'reviews']);

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('theme')) {
            $query->where('theme', $request->theme);
        }

        if ($request->filled('tag')) {
            $query->whereHas('tags', fn ($query) => $query->where('name', $request->tag));
        }

        $products = $query->paginate(12);

        return $this->success(ProductResource::collection($products)->response()->getData(true), 'Products retrieved');
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['images', 'tags', 'reviews.user']);

        return $this->success(new ProductResource($product), 'Product details');
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        $this->syncTags($product, $request->input('tags', []));
        $this->storeImages($product, $request);

        return $this->success(new ProductResource($product->load(['images', 'tags'])), 'Product created', 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());
        $this->syncTags($product, $request->input('tags', []));
        $this->storeImages($product, $request);

        return $this->success(new ProductResource($product->load(['images', 'tags'])), 'Product updated');
    }

    public function destroy(Product $product): JsonResponse
    {
        foreach ($product->images as $image) {
            if (str_starts_with($image->image_url, 'storage/')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $image->image_url));
            }
        }

        $product->delete();

        return $this->success(null, 'Product deleted', 204);
    }

    public function like(Product $product): JsonResponse
    {
        $user = auth()->user();

        Like::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        return $this->success(null, 'Product liked');
    }

    public function unlike(Product $product): JsonResponse
    {
        $user = auth()->user();

        Like::where(['user_id' => $user->id, 'product_id' => $product->id])->delete();

        return $this->success(null, 'Product unliked');
    }

    protected function syncTags(Product $product, array $tags): void
    {
        if (empty($tags)) {
            $product->tags()->sync([]);
            return;
        }

        $tagIds = collect($tags)->map(fn ($tag) => trim($tag))->filter()->map(fn ($tag) => Tag::firstOrCreate(['name' => $tag])->id)->toArray();

        $product->tags()->sync($tagIds);
    }

    protected function storeImages(Product $product, Request $request): void
    {
        foreach ($request->file('images', []) as $file) {
            $path = $file->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => Storage::url($path),
            ]);
        }

        foreach ($request->input('image_urls', []) as $url) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $url,
            ]);
        }
    }
}
