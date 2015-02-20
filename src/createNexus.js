import Local from 'nexus-flux/adapters/Local';
import RemoteClient from 'nexus-flux-socket.io/client';
import uuid from 'node-uuid';

function createLocal() {
  const stores = {
    '/clientId': uuid.v4(),
  };
}

function createRemote() {

}

function createNexus() {
  return {
    local: createLocal(),
    remote: createRemote(),
  };
}
