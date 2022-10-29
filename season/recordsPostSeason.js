module.exports = {
    testPostSeasonRecords: function(gameData, season, matchPlayed){
        checkVictories(gameData, season, matchPlayed)
        checkGoals(gameData, season, matchPlayed)
    }
}

function checkVictories(gameData, season, matchPlayed){
    let victoryRecords = gameData.seasons[season].records.postSeason.victories;
    if(matchPlayed.team1Goals > matchPlayed.team2Goals){
        let mostPlayoffVictoriesIndex = victoryRecords.mostPlayoffVictories.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
        victoryRecords.mostPlayoffVictories.teams[mostPlayoffVictoriesIndex].record++;
        let mostPlayoffVictoriesHomeIndex = victoryRecords.mostPlayoffVictoriesHome.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
        victoryRecords.mostPlayoffVictoriesHome.teams[mostPlayoffVictoriesHomeIndex].record++;
    }
    else if(matchPlayed.team2Goals > matchPlayed.team1Goals){
        let mostPlayoffVictoriesIndex = victoryRecords.mostPlayoffVictories.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
        victoryRecords.mostPlayoffVictories.teams[mostPlayoffVictoriesIndex].record++;
        let mostPlayoffVictoriesAwayIndex = victoryRecords.mostPlayoffVictoriesAway.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
        victoryRecords.mostPlayoffVictoriesAway.teams[mostPlayoffVictoriesAwayIndex].record++;
    }
    else{
        if(matchPlayed.team1GoalsAddTime > matchPlayed.team2GoalsAddTime){
            let mostPlayoffVictoriesIndex = victoryRecords.mostPlayoffVictories.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
            victoryRecords.mostPlayoffVictories.teams[mostPlayoffVictoriesIndex].record++;
            let mostPlayoffVictoriesHomeIndex = victoryRecords.mostPlayoffVictoriesHome.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
            victoryRecords.mostPlayoffVictoriesHome.teams[mostPlayoffVictoriesHomeIndex].record++;
            let mostAddTimeVictoriesIndex = victoryRecords.mostAddTimeVictories.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
            victoryRecords.mostAddTimeVictories.teams[mostAddTimeVictoriesIndex].record++;
            let mostAddTimeVictoriesHomeIndex = victoryRecords.mostAddTimeVictoriesHome.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
            victoryRecords.mostAddTimeVictoriesHome.teams[mostAddTimeVictoriesHomeIndex].record++;
        }
        else{
            let mostPlayoffVictoriesIndex = victoryRecords.mostPlayoffVictories.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
            victoryRecords.mostPlayoffVictories.teams[mostPlayoffVictoriesIndex].record++;
            let mostPlayoffVictoriesAwayIndex = victoryRecords.mostPlayoffVictoriesAway.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
            victoryRecords.mostPlayoffVictoriesAway.teams[mostPlayoffVictoriesAwayIndex].record++;
            let mostAddTimeVictoriesIndex = victoryRecords.mostAddTimeVictories.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
            victoryRecords.mostAddTimeVictories.teams[mostAddTimeVictoriesIndex].record++;
            let mostAddTimeVictoriesAwayIndex = victoryRecords.mostAddTimeVictoriesAway.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
            victoryRecords.mostAddTimeVictoriesAway.teams[mostAddTimeVictoriesAwayIndex].record++;
        }
    }
}

function checkGoals(gameData, season, matchPlayed){
    let goalRecords = gameData.seasons[season].records.postSeason.goals;

    let mostGoalsScoredInPlayoffsIndex = goalRecords.mostGoalsScoredInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
    goalRecords.mostGoalsScoredInPlayoffs.teams[mostGoalsScoredInPlayoffsIndex].record += matchPlayed.team1Goals;
    mostGoalsScoredInPlayoffsIndex = goalRecords.mostGoalsScoredInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
    goalRecords.mostGoalsScoredInPlayoffs.teams[mostGoalsScoredInPlayoffsIndex].record += matchPlayed.team2Goals;

    let mostGoalsScoredHomeInPlayoffsIndex = goalRecords.mostGoalsScoredHomeInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
    goalRecords.mostGoalsScoredHomeInPlayoffs.teams[mostGoalsScoredHomeInPlayoffsIndex].record += matchPlayed.team1Goals;
    let mostGoalsScoredAwayInPlayoffsIndex = goalRecords.mostGoalsScoredAwayInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
    goalRecords.mostGoalsScoredAwayInPlayoffs.teams[mostGoalsScoredAwayInPlayoffsIndex].record += matchPlayed.team2Goals;

    if(matchPlayed.team2Goals == 0){
        let mostShutoutsInPlayoffsIndex = goalRecords.mostShutoutsInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
        goalRecords.mostShutoutsInPlayoffs.teams[mostShutoutsInPlayoffsIndex].record++;
        let mostShutoutsHomeInPlayoffsIndex = goalRecords.mostShutoutsHomeInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team1Id);
        goalRecords.mostShutoutsHomeInPlayoffs.teams[mostShutoutsHomeInPlayoffsIndex].record++;
    }
    if(matchPlayed.team1Goals == 0){
        let mostShutoutsInPlayoffsIndex = goalRecords.mostShutoutsInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
        goalRecords.mostShutoutsInPlayoffs.teams[mostShutoutsInPlayoffsIndex].record++;
        let mostShutoutsAwayInPlayoffsIndex = goalRecords.mostShutoutsAwayInPlayoffs.teams.findIndex(team => team.teamId == matchPlayed.team2Id);
        goalRecords.mostShutoutsAwayInPlayoffs.teams[mostShutoutsAwayInPlayoffsIndex].record++;
    }

}