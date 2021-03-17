import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Navigation: FC = () => {
  return (
    <>
      <ul>
        <li>
          <h1>
            <Link to='/'>AtCoder Alarm</Link>
          </h1>
        </li>
        <li>
          <Link to='/todos'>Todoリスト</Link>
        </li>
      </ul>
    </>
  );
}

export default Navigation;