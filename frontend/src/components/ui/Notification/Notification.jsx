import {Alert, ThemeProvider} from '@gravity-ui/uikit';
import {useState} from 'react';

import cl from './Notification.module.css';



export default function Notification ({defaultDismissByFlag = false, ...data}) {
  const [dismissByFlag, setDismissByFlag] = useState(defaultDismissByFlag);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const classes = [cl.notification];

  if (dismissByFlag) {
    classes.push(cl.hide);
  }
  
  return (
    <div className={classes.join(' ')}>
      <ThemeProvider theme={isLightTheme ? "light" : "dark"}>
        <Alert
        align="center"
        onClose={() => setDismissByFlag(true)} 
        corners="square"
        title={data?.title || "Заменяющий заголовок"}
        message={data?.message || "Заменяющий текст на 100 символов я надеюсь для проверки адаптивности блаблабаба"}
        theme={data?.theme} 
        actions={<Alert.Action onClick={() => setIsLightTheme(!isLightTheme)}>Смена темы уведомления</Alert.Action>}
        />
      </ThemeProvider>
    </div>
  )
}