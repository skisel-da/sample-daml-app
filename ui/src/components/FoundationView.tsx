// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import {Container, Grid, Header} from 'semantic-ui-react';
import { Portfolio } from '@daml.js/create-daml-app';
import {useParty, useStreamFetchByKeys, useStreamQueries} from '@daml/react';
import IdentityCheckView from './IdentityCheckView';
import IssueContractView from "./IssueContractView";
import WithdrawalRequestsView from "./WithdrawalRequestsView";
import Ledger from "@daml/ledger";
import ActiveContractsFoundationView from "./ActiveContractsFoundationView";

type Props = {
  ledger: Ledger;
}

// USERS_BEGIN
const FoundationView: React.FC<Props> = (props) => {
  const username = useParty();
  const myUserResult = useStreamFetchByKeys(Portfolio.FoundationUser, () => [username], [username]);
  const myUser = myUserResult.contracts[0]?.payload;
  const ikyContracts = useStreamQueries(Portfolio.IKnowYou).contracts;
  const withdrawals = useStreamQueries(Portfolio.FullWithdrawalRequest).contracts;
  const contracts = useStreamQueries(Portfolio.Contract).contracts;
  const ledger = props.ledger;

  const myCustomers = useMemo(
      () => ikyContracts
          .map(contract => contract.payload)
      ,
      [ikyContracts]
  );

  const myWithdrawals = useMemo(
      () => withdrawals
          .map(contract => contract.payload)
      ,
      [withdrawals]
  );

  const myContracts = useMemo(
      () => contracts
          .map(contract => contract.payload)
      ,
      [contracts]
  );

  const onProvideContract = async (iky: Portfolio.IKnowYou, contractId: string): Promise<boolean> => {
    try {
      let contract: Portfolio.Contract = {
        foundation: username,
        number: contractId,
        owner: iky.owner,
        deposits: [],
        balance: "0.0",
      };
      await ledger.create(Portfolio.ContractOffer, { contract });
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const onApproveWithdrawal = async (r: Portfolio.FullWithdrawalRequest): Promise<boolean> => {
    try {
      let key = {
        _1: r.contract.owner,
        _2: r.contract.number
      };
      await ledger.exerciseByKey(Portfolio.FullWithdrawalRequest.AcceptWithdrawal, key, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }


  return (
    <Container>
      <Grid centered columns={3}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
              {myUser ? `Issue Contracts` : 'Loading...'}
            </Header>
            <IssueContractView ikysInput={myCustomers} onProvideContract={onProvideContract}/>
          </Grid.Column>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
              {myUser ? `Active Portfolios` : 'Loading...'}
            </Header>
            <ActiveContractsFoundationView contracts={myContracts}/>
          </Grid.Column>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
              {myUser ? `Withdrawal Requests` : 'Loading...'}
            </Header>
            <WithdrawalRequestsView withdrawals={myWithdrawals} onApproveWithdrawal={onApproveWithdrawal}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default FoundationView;
