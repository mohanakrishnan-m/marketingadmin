<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaign_recipients', function (Blueprint $table) {
            $table->string('tracking_token', 64)->nullable()->unique()->after('client_id');
        });

        DB::table('campaign_recipients')
            ->select('id')
            ->orderBy('id')
            ->chunkById(100, function ($recipients): void {
                foreach ($recipients as $recipient) {
                    DB::table('campaign_recipients')
                        ->where('id', $recipient->id)
                        ->update(['tracking_token' => Str::random(64)]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('campaign_recipients', function (Blueprint $table) {
            $table->dropUnique(['tracking_token']);
            $table->dropColumn('tracking_token');
        });
    }
};
