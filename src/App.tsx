import './styles/index.scss';
import TasksView from './components/tasksView/TasksView'
// contexts
import { SkeletonTheme } from 'react-loading-skeleton';

function App() {
  return (
    <SkeletonTheme baseColor='#333' highlightColor='#383838'>
      <TasksView/>
    </SkeletonTheme>
  )
}

export default App
