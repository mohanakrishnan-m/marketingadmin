<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|max:150|unique:users,email',
            'company'  => 'nullable|string|max:200',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'company'  => $data['company'] ?? null,
            'password' => Hash::make($data['password']),
        ]);

        // Create default settings row with pre-configured SMTP
        Setting::create([
            'user_id'      => $user->id,
            'smtp_host'    => env('MAIL_HOST', 'mail.risingiceberg.com'),
            'smtp_port'    => (int) env('MAIL_PORT', 465),
            'smtp_username'=> env('MAIL_USERNAME', 'subratsethi@risingiceberg.com'),
            'sender_email' => env('MAIL_FROM_ADDRESS', 'subratsethi@risingiceberg.com'),
            'sender_name'  => env('MAIL_FROM_NAME', 'Iceberg Marketing'),
            'reply_to'     => env('MAIL_USERNAME', 'subratsethi@risingiceberg.com'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        // Revoke old tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
