module.exports = {
    teamPage: function(teamId){
        sessionStorage.setItem("team", teamId);
        location.href = "../team/team.html";
    }
}