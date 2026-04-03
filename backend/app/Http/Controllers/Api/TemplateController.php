<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $templates = $request->user()
            ->emailTemplates()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($templates->map(fn($t) => $this->formatTemplate($t)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:200',
            'subject' => 'required|string|max:300',
            'content' => 'required|string',
        ]);

        $template = $request->user()->emailTemplates()->create($data);

        return response()->json($this->formatTemplate($template), 201);
    }

    public function show(Request $request, $id)
    {
        $template = $request->user()->emailTemplates()->findOrFail($id);

        return response()->json($this->formatTemplate($template));
    }

    public function update(Request $request, $id)
    {
        $template = $request->user()->emailTemplates()->findOrFail($id);

        $data = $request->validate([
            'name'    => 'required|string|max:200',
            'subject' => 'required|string|max:300',
            'content' => 'required|string',
        ]);

        $template->update($data);

        return response()->json($this->formatTemplate($template));
    }

    public function destroy(Request $request, $id)
    {
        $template = $request->user()->emailTemplates()->findOrFail($id);
        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }

    private function formatTemplate(EmailTemplate $t): array
    {
        return [
            'id'        => $t->id,
            'name'      => $t->name,
            'subject'   => $t->subject,
            'content'   => $t->content,
            'createdAt' => $t->created_at ? $t->created_at->toDateString() : null,
        ];
    }
}
