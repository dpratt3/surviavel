<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            Schema::create('life_tables', function (Blueprint $table) {
                $table->id();
                $table->integer('exact_age');
                $table->double('male_death_probability');
                $table->integer('male_number_of_lives');	
                $table->double('male_life_expectancy');	
                $table->double('female_death_probability');	
                $table->integer('female_number_of_lives');	
                $table->double('female_life_expectancy');	
                $table->integer('year');
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('life_tables');
    }
};
