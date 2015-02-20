import Server from 'nexus-flux-socket.io/server';
import createError from 'http-errors';
import sha256 from 'sha256';

const stores = {
  '/tasks': new Remutable({}),
  '/info': new Remutable({
    totalVisits: 0,
    totalTasks: 0,
    uptime: 0,
  }),
};

class TodoMVCServer extends Server {
  constructor() {
    super(...arguments);
  }

  serveStore({ path }) {
    return Promise.try(() => {
      if(stores[path] !== void 0) {
        return stores[path];
      }
      throw new createError(404);
    });
  },
}

const server = new TodoMVCServer(8080);
const start = Date.now();

const actions = {
  '/addTask': ({ name, ownerKey }) => {
    server.dispatchUpdate('/tasks', stores['/tasks'].set(name, sha256(ownerKey)).commit());
    server.dispatchUpdate('/info', stores['/info'].set('totalTasks', stores['/info'].get('totalTasks') + 1).commit());
  },
  '/removeTask': ({ name, ownerKey }) => {
    if(sha256(stores['/tasks'].get(name)) === sha256(ownerKey)) {
      server.dispatchUpdate('/tasks', stores['/tasks'].set(name, void 0).commit());
    }
  },
  '/visit': () => {
    server.dispatchUpdate('/info', stores['/info'].set('totalVisits', stores['/info'].get('totalVisits') + 1).commit());
  }
};


server.lifespan.setInterval(() => server.dispatchUpdate(stores['/info'].set('uptime', Date.now() - start).commit()), 100);
server.on('action', ({ path, params }) => {
  if(actions[path] !== void 0) {
    actions[path](params);
  }
}, server.lifespan);
