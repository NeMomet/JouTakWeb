import {useState} from 'react';
import {Button, Alert} from '@gravity-ui/uikit';

export default function Notification ({data}) {
  
  const [dismissByFlag, setDismissByFlag] = useState(false);
  
  function hideNotification() {
    setDismissByFlag(true);
  }

  console.log(dismissByFlag);

  return (
    <div className="notification" style={{display: (dismissByFlag ? "none" : "flex")}}>
      <Alert
        onClose={hideNotification} 
        theme="normal"
        icon={<img style={{height:48}} src="https://cdn-icons-png.flaticon.com/512/7734/7734348.png" />}
        title={data?.title|| "Заменяющий заголовок"}
        message={data?.message || "Заменяющий текст на 100 символов я надеюсь для проверки адаптивности блаблабаба"}
        />
    </div>
  )
}