// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import {Container, Grid, Header, Icon, Segment, Divider} from 'semantic-ui-react';
import { Portfolio } from '@daml.js/create-daml-app';
import {useParty, useStreamFetchByKeys, useStreamQueries} from '@daml/react';
import CreateIdentity from "./CreateIdentity";
import IdentityView from './IdentityView';
import ContractOfferApproveView from "./ContractOfferApproveView";
import Ledger from "@daml/ledger";
import ActiveContractsView from "./ActiveContractsView";

type Props = {
  ledger: Ledger;
}

const CustomerView: React.FC<Props> = (props) => {
  const username = useParty();
  const myUserResult = useStreamFetchByKeys(Portfolio.Customer, () => [username], [username]);
  const myUser = myUserResult.contracts[0]?.payload;
  const kycCheckContracts = useStreamQueries(Portfolio.KycCheck).contracts;
  const ikyContracts = useStreamQueries(Portfolio.IKnowYou).contracts;
  const offersContracts = useStreamQueries(Portfolio.ContractOffer).contracts;
  const contractContracts = useStreamQueries(Portfolio.Contract).contracts;
  const ledger = props.ledger;

  const kycChecks = useMemo(
      () => kycCheckContracts
          .map(contract => contract.payload)
          .filter(check => check.check.owner === username)
          .map(check => check.check)
      ,
      [kycCheckContracts, username]
  );

  const ikys = useMemo(
      () => ikyContracts
          .map(contract => contract.payload)
          .filter(check => check.owner === username)
      ,
      [ikyContracts, username]
  );

  const offers = useMemo(
      () => offersContracts
          .map(contract => contract.payload)
          .filter(check => check.contract.owner === username)
      ,
      [offersContracts, username]
  );

  const contracts =  useMemo(
      () => contractContracts
          .map(contract => contract.payload)
          .filter(contract => contract.owner === username)
      ,
      [contractContracts, username]
  );

  const onAddIdentity = async (iky: Portfolio.IKnowYou): Promise<boolean> => {
    try {
      const kycCheck: Portfolio.KycCheck = {
        check: iky
      }
      await ledger.create(Portfolio.KycCheck, kycCheck);
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const onApproveOffer =  async (offer: Portfolio.ContractOffer): Promise<boolean> => {
    try {
      let key = {
        _1: offer.contract.foundation,
        _2: offer.contract.number
      };
      await ledger.exerciseByKey(Portfolio.ContractOffer.AcceptContract, key, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }


  const onDepositMoney =  async (contract: Portfolio.Contract, depositAmount: string): Promise<boolean> => {
    try {
      let key = {
        _1: contract.foundation,
        _2: contract.number
      };
      await ledger.exerciseByKey(Portfolio.Contract.AddDeposit, key, {depositAmount});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const onFullWithdrawal = async (contract: Portfolio.Contract): Promise<boolean> => {
    try {
      let key = {
        _1: contract.foundation,
        _2: contract.number
      };
      await ledger.exerciseByKey(Portfolio.Contract.WithdrawRequest, key,{});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const isValidated = (): boolean => {
    return ikys.length === 1;
  }
  const isPendingValidation = (): boolean => {
    return kycChecks.length === 1;
  }
  const identity = (): Portfolio.IKnowYou | undefined => {
    if (isValidated()) return ikys.at(0);
    else if (isPendingValidation()) return kycChecks.at(0);
    else return undefined;
  }

  const kycIsRequired = (): boolean => {
    return ikys.length === 0 && kycChecks.length === 0;
  }

  const identityContainer = (iky: Portfolio.IKnowYou | undefined) => {
    if (iky === undefined) { return undefined; }
    else return <IdentityView iky={iky}/>;
  }

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUser ? `Welcome, ${myUser.username}!` : 'Loading...'}
            </Header>

            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                {isValidated() ? <Icon name='check' style={{color: '#008000'}} /> : undefined}
                <Header.Content>
                  <Header.Subheader>
                    {
                      identityContainer(identity())
                    }
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              {kycIsRequired() ? <CreateIdentity onAddIdentity={onAddIdentity}/> : undefined}

            </Segment>
          </Grid.Column>
          {
              offers.length > 0 ?  <Grid.Column>
                <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                  {myUser ? `Approve Portfolio Offers` : 'Loading...'}
                </Header>
                <ContractOfferApproveView offers={offers} onApproveOffer={onApproveOffer}/>
              </Grid.Column> : undefined
          }

          { contracts.length > 0 ? <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
              {myUser ? `Active Portfolio` : 'Loading...'}
            </Header>
            <ActiveContractsView contracts={contracts} onDepositMoney={onDepositMoney} onFullWithdrawal={onFullWithdrawal}/>
          </Grid.Column> : undefined
          }

        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default CustomerView;
