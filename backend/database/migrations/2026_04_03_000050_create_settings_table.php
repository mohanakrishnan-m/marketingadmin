<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('sender_name', 100)->nullable();
            $table->string('sender_email', 150)->nullable();
            $table->string('reply_to', 150)->nullable();
            $table->string('smtp_host', 200)->nullable();
            $table->unsignedSmallInteger('smtp_port')->default(587);
            $table->string('smtp_username', 200)->nullable();
            $table->string('smtp_password_encrypted')->nullable();
            $table->string('footer_text', 500)->nullable();
            $table->boolean('notif_campaign_sent')->default(true);
            $table->boolean('notif_client_added')->default(true);
            $table->boolean('notif_open_rate_alert')->default(false);
            $table->boolean('notif_weekly_report')->default(true);
            $table->boolean('notif_system_alerts')->default(true);
            $table->boolean('two_factor')->default(false);
            $table->unsignedSmallInteger('session_timeout')->default(60);
            $table->boolean('login_alerts')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
