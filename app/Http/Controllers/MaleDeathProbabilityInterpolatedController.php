<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaleDeathProbabilityInterpolated; 

class MaleDeathProbabilityInterpolatedController extends Controller
{
    public function index()
    {
        // Retrieve life expectancy data from the database
        $maleDeathProbabilityInterpolatedData = MaleDeathProbabilityInterpolated::all();

        // Return the data as a JSON response
        return response()->json($maleDeathProbabilityInterpolatedData);
    }
}
