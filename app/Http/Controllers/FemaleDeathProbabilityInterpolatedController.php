<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FemaleDeathProbabilityInterpolated; 

class FemaleDeathProbabilityInterpolatedController extends Controller
{
    public function index()
    {
        // Retrieve life expectancy data from the database
        $femaleDeathProbabilityInterpolatedData = FemaleDeathProbabilityInterpolated::all();

        // Return the data as a JSON response
        return response()->json($femaleDeathProbabilityInterpolatedData);
    }
}
