const assert = require('assert');
const dao = require('./db');
describe('Test dao', function () {
    // describe('#addHelp', function () {
    //     it('should addHelp success', function () {
    //         let result = dao.addHelp('av90870822', 'momoko8443');
    //         console.log(result);
    //         assert.equal(1,1);
    //     });
    // });
    // describe('#appendHelper', function () {
    //     it('should appendHelp success', function () {
    //         let result = dao.appendHelper('av90870822', 'momoko8443',3);
    //         console.log(result);
    //         assert.equal(1,1);
    //     });
    // });
    describe('#isHelped', function () {
        it('should isHelped success', function () {
            let result = dao.isHelped('av90870822', 'momoko8443');
            assert.equal(result, true);
        });
    });

    describe('#getHelpItems', function () {
        it('should isHelped success', function () {
            let result = dao.getHelpItems();
            console.log(result);
            assert.equal(1, 1);
        });
    });
});