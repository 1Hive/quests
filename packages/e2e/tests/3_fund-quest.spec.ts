import {
    connectWithMetamask,
    executeTransaction,
    expectTextExistsInPage,
    fillInputBySelector,
    gotoApp,
    sleep,
    waitForSelectorAndClick,
    waitForTestIdAndClick,
  } from '../helpers/utils';


  describe('Fund quest', ()=>{
    beforeAll(async()=>{
        await gotoApp();
        await connectWithMetamask();
        
    })
  })