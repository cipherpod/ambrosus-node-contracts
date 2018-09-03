/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import KycWhitelistWrapper from '../../src/wrappers/kyc_whitelist_wrapper';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('KYC Whitelist Wrapper', () => {
  let contractManagerMock;
  let kycWhitelistWrapper;
  const defaultAddress = '0x6789';
  const exampleAddress = '0x1234';
  const exampleRole = 2;
  const exampleRequiredDeposit = 10000;

  describe('add', () => {
    let addStub;
    let addSendStub;

    before(async () => {
      addStub = sinon.stub();
      addSendStub = sinon.stub();
      contractManagerMock = {
        kycWhitelistContract: async () => ({
          methods: {
            add: addStub.returns({
              send: addSendStub.resolves()
            })
          }
        }),
        defaultAddress: () => defaultAddress
      };
      kycWhitelistWrapper = new KycWhitelistWrapper(contractManagerMock);
    });

    it('calls contract method with correct arguments', async () => {
      await kycWhitelistWrapper.add(exampleAddress, exampleRole, exampleRequiredDeposit);
      expect(addStub).to.be.calledWith(exampleAddress, exampleRole, exampleRequiredDeposit);
      expect(addSendStub).to.be.calledOnceWith({from: defaultAddress});
    });
  });

  describe('remove', () => {
    let removeStub;
    let removeSendStub;

    before(async () => {
      removeStub = sinon.stub();
      removeSendStub = sinon.stub();
      contractManagerMock = {
        kycWhitelistContract: async () => ({
          methods: {
            remove: removeStub.returns({
              send: removeSendStub.resolves()
            })
          }
        }),
        defaultAddress: () => defaultAddress
      };
      kycWhitelistWrapper = new KycWhitelistWrapper(contractManagerMock);
    });

    it('calls contract method with correct arguments', async () => {
      await kycWhitelistWrapper.remove(exampleAddress);
      expect(removeStub).to.be.calledWith(exampleAddress);
      expect(removeSendStub).to.be.calledOnceWith({from: defaultAddress});
    });
  });

  describe('isWhitelisted', () => {
    let isWhitelistedStub;
    let isWhitelistedCallStub;

    before(async () => {
      isWhitelistedStub = sinon.stub();
      isWhitelistedCallStub = sinon.stub();
      contractManagerMock = {
        kycWhitelistContract: async () => ({
          methods: {
            isWhitelisted: isWhitelistedStub.returns({
              call: isWhitelistedCallStub.resolves(1)
            })
          }
        })
      };
      kycWhitelistWrapper = new KycWhitelistWrapper(contractManagerMock);
    });

    it('calls contract method with correct arguments', async () => {
      const ret = await kycWhitelistWrapper.isWhitelisted(exampleAddress);
      expect(isWhitelistedStub).to.be.calledWith(exampleAddress);
      expect(isWhitelistedCallStub).to.be.calledOnce;
      expect(ret).to.equal(1);
    });
  });

  describe('hasRoleAssigned', () => {
    let hasRoleAssignedStub;
    let hasRoleAssignedCallStub;

    before(async () => {
      hasRoleAssignedStub = sinon.stub();
      hasRoleAssignedCallStub = sinon.stub();
      contractManagerMock = {
        kycWhitelistContract: async () => ({
          methods: {
            hasRoleAssigned: hasRoleAssignedStub.returns({
              call: hasRoleAssignedCallStub.resolves(1)
            })
          }
        })
      };
      kycWhitelistWrapper = new KycWhitelistWrapper(contractManagerMock);
    });

    it('calls contract method with correct arguments', async () => {
      await kycWhitelistWrapper.hasRoleAssigned(exampleAddress, exampleRole);
      expect(hasRoleAssignedStub).to.be.calledWith(exampleAddress, exampleRole);
      expect(hasRoleAssignedCallStub).to.be.calledOnce;
    });
  });
});