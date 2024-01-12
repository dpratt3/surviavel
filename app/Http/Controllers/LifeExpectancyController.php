<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LifeExpectancy; 

class LifeExpectancyController extends Controller
{
    public function index()
    {
        // Retrieve life expectancy data from the database
        $lifeExpectancyData = LifeExpectancy::all();

        // Return the data as a JSON response
        return response()->json($lifeExpectancyData);
    }
}
