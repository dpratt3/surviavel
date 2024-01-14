<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FemaleLifeExpectancyInterpolated; 

class FemaleLifeExpectancyInterpolatedController extends Controller
{
    public function index()
    {
        // Retrieve life expectancy data from the database
        $femaleLifeExpectancyInterpolatedData = FemaleLifeExpectancyInterpolated::all();

        // Return the data as a JSON response
        return response()->json($femaleLifeExpectancyInterpolatedData);
    }
}
