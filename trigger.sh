daml trigger --dar .daml/dist/create-daml-app-0.1.0.dar \
             --trigger-name AutoApproveTrigger:autoApproveTrigger \
             --ledger-host 127.0.0.1 \
             --ledger-port 6865 \
             --ledger-party "foundation"