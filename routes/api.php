Route::post('/score', [ScoreController::class, 'store']);
Route::get('/leaderboard', [ScoreController::class, 'topScores']);