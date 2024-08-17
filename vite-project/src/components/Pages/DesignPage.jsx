import { useEffect } from 'react';
import '../../css/Design.css';

const Design = () => {
  useEffect(() => {
    // Sayfa değişikliğinde kullanıcıya uyarı göster
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Chrome için
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleCaptureClick = () => {
    fetch('http://localhost:5000/api/capture/capture', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        console.log('Ekran alıntısı aracı başlatıldı:', data);
      })
      .catch(error => {
        console.error('Ekran alıntısı aracı başlatılamadı:', error);
      });
  };

  useEffect(() => {
    // Kullanıcının tasarım sayfasına girmesiyle sayfayı temizle
    const cleanDesign = () => {
      // Burada sayfanın temizlenmesi ile ilgili işlemleri yapabilirsiniz
      // Örneğin, tasarım verilerini temizlemek için API çağrısı yapabilirsiniz.
    };

    cleanDesign();
  }, []);

  return (
    <div className="design-container">
      <button onClick={handleCaptureClick} className='capture-screen-button'>
        Capture Screen
      </button>
      <iframe
        src="http://localhost:3000/src/three.js/editor/index.html"
        title="Three.js Editor"
        style={{ width: '100%', height: '800px', border: 'none' }}
      ></iframe>
    </div>
  );
}

export default Design;
