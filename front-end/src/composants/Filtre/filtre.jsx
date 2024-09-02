import React, { useState } from 'react';

const SignupForm = () => {
  const [pmeId, setPmeId] = useState(null);
  const [subscriptionNumber, setSubscriptionNumber] = useState(null);

  const pmes = [
    { id: 1, name: 'PME A' },
    { id: 2, name: 'PME B' },
    { id: 3, name: 'PME C' },
  ];

  const handleSelectPme = (id) => {
    setPmeId(id);
    const generatedNumber = `NUM-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubscriptionNumber(generatedNumber);
  };

  return (
    <div>
      <h2>Select a PME</h2>
      <ul>
        {pmes.map((pme) => (
          <li key={pme.id}>
            <button onClick={() => handleSelectPme(pme.id)}>
              Select {pme.name}
            </button>
          </li>
        ))}
      </ul>

      {pmeId && (
        <div>
          <h3>PME ID: {pmeId}</h3>
          <h3>Subscription Number: {subscriptionNumber}</h3>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
