import taskStyles from '../tasks.module.scss';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton';

export const TaskSkeleton = () => {
  return (
    <div className={taskStyles.taskSkeleton}>
      <h3 className={taskStyles.taskTitle}>
        <Skeleton count={1} width={"70%"}/>
      </h3>
      <span className={taskStyles.description}>
        <Skeleton count={2}/>
      </span>
      <div className={taskStyles.taskFooter}>
        <div className={taskStyles.checkboxContainer}>
        <Skeleton circle width={"1.5rem"} height={"1.5rem"}/>
        <Skeleton count={1} width={"8rem"}/>
        </div>
      </div>
    </div>
  )
}
