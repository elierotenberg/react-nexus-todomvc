import Nexus from 'react-nexus';
const { React } = Nexus;

const App = React.createClass({
  mixins: [Nexus.Mixin, React.addons.PureRenderMixin],

  getNexusBindings() {
    return {
      'tasks': [this.getNexus().remote, '/tasks'],
      'info': [this.getNexus().remote, '/info'],
    };
  },

  render() {
    const { tasks, info } = this.state;
    return <div>
      <h1>React Nexus TodoMVC</h1>
      <div>Total visits: {info && info.totalVisits}</div>
      <div>Total tasks: {tasks && info.totalTasks}</div>
      <Tasks tasks={tasks} />
    </div>;
  },
});

export default App;
