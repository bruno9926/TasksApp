import Confetti from 'react-confetti-boom';

const TaskConfetti = ({show}: {show: boolean}) => {

  const isMobile = window.innerWidth < 768;

  const shapeSize = isMobile ? 25 : 12;
  const fadeOutHeight = isMobile ? 0.8 : 0.5;

  return (
    <Confetti mode="fall" fadeOutHeight={show ? fadeOutHeight : 0} shapeSize={shapeSize}/>
  )
}

export default TaskConfetti