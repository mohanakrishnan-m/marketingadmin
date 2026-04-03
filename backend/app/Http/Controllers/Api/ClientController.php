<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $clients = $request->user()
            ->clients()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($clients->map(fn($client) => $this->formatClient($client)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'businessName'  => 'required|string|max:100',
            'contactName'   => 'required|string|max:100',
            'whatsapp'      => 'required|string|regex:/^\d{1,15}$/',
            'email'         => 'required|email|max:100',
            'category'      => 'required|array|min:1|max:5',
            'category.*'    => 'required|string|max:100',
        ]);

        $client = $request->user()->clients()->create([
            'business_name' => $data['businessName'],
            'contact_name'  => $data['contactName'],
            'whatsapp'      => $data['whatsapp'],
            'email'         => $data['email'],
            'category'      => $data['category'],
        ]);

        return response()->json($this->formatClient($client), 201);
    }

    public function show(Request $request, $id)
    {
        $client = $request->user()->clients()->findOrFail($id);

        return response()->json($this->formatClient($client));
    }

    public function update(Request $request, $id)
    {
        $client = $request->user()->clients()->findOrFail($id);

        $data = $request->validate([
            'businessName'  => 'required|string|max:100',
            'contactName'   => 'required|string|max:100',
            'whatsapp'      => 'required|string|regex:/^\d{1,15}$/',
            'email'         => 'required|email|max:100',
            'category'      => 'required|array|min:1|max:5',
            'category.*'    => 'required|string|max:100',
        ]);

        $client->update([
            'business_name' => $data['businessName'],
            'contact_name'  => $data['contactName'],
            'whatsapp'      => $data['whatsapp'],
            'email'         => $data['email'],
            'category'      => $data['category'],
        ]);

        return response()->json($this->formatClient($client));
    }

    public function destroy(Request $request, $id)
    {
        $client = $request->user()->clients()->findOrFail($id);
        $client->delete();

        return response()->json(['message' => 'Client deleted successfully']);
    }

    private function formatClient(Client $client): array
    {
        return [
            'id'           => $client->id,
            'businessName' => $client->business_name,
            'contactName'  => $client->contact_name,
            'whatsapp'     => $client->whatsapp,
            'email'        => $client->email,
            'category'     => $client->category ?? [],
        ];
    }
}
