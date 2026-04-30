<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends BaseController
{
    public function index(): JsonResponse
    {
        $tags = Tag::orderBy('name')->get();
        return $this->success(TagResource::collection($tags), 'Tags retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:50|unique:tags,name']);
        $tag = Tag::create($data);

        return $this->success(new TagResource($tag), 'Tag created', 201);
    }

    public function update(Request $request, Tag $tag): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:50|unique:tags,name,' . $tag->id]);
        $tag->update($data);

        return $this->success(new TagResource($tag), 'Tag updated');
    }

    public function destroy(Tag $tag): JsonResponse
    {
        $tag->products()->detach();
        $tag->delete();

        return $this->success(null, 'Tag deleted', 204);
    }
}
