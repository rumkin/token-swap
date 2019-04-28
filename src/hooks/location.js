import {useState, useEffect} from 'react';
import {useHistory} from './history';

export function useLocation() {
  const history = useHistory();
  const [location, setLocation] = useState(history.location);

  useEffect(() =>
    history.listen(location => {
      setLocation(location);
    }),
  );

  return [location];
}
