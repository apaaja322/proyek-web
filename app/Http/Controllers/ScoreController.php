<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function store(Request $request)
    {
        $score = new Score();
        $score->player_name = $request->player_name;
        $score->score = $request->score;
        $score->save();

        return response()->json(['message' => 'Score saved!']);
    }

    public function topScores()
    {
        $scores = Score::orderBy('score', 'desc')->take(10)->get();
        return response()->json($scores);
    }
}