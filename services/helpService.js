const dao = require('../dao/db');
const publishCost = 10;
module.exports = {
    publishHelp(avcode,requesterUsername){
        let requester = dao.getUser(requesterUsername);
        if(requester.coin >= publishCost){
            let exists = dao.getHelp(avcode).length > 0 ? true:false;
            if(!exists){
                dao.reduceUserCoin(requesterUsername, publishCost);
                return dao.addHelp(avcode, requesterUsername);
            }else{
                return null;
            }
        }
        return null;
    },
    doHelp(avcode,helper,score){
        let exists = this.getHelp(avcode);
        if(!exists){
            return null;
        }
        let isHelped = dao.isHelped(avcode,helper);
        if(isHelped){
            return null;
        }
        if(isNaN(score) || score > 3){
            return null;
        }
        dao.appendHelper(avcode, helper, score);
        return dao.incrementUserCoin(helper,score);
    },
    getHelpItems(helper){
        return dao.getLatestHelpItems(helper);
    },

    getHelp(avcode){
        return dao.getHelp(avcode);
    }
}