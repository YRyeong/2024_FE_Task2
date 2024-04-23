import React, { useState, useEffect } from 'react';
import './App.css';

function Container() {
  const [amount, setAmount] = useState('');
  const [selectCurrency, setSelectCurrency] = useState('USD');
  const [listCurrency, setListCurrency] = useState('CAD');
  const [data, setData] = useState(null);
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [result, setResult] = useState(null);
  const [date, setDate] = useState(null);

  const currencies = ['USD', 'CAD', 'KRW', 'HKD', 'JPY', 'CNY'];
  const convertMonthToEnglish = (monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(monthNumber) - 1];
  };

  let convertedDate = '';
  if (date) {
    const [year, month, day] = date.split('-');
    convertedDate = `${year}-${convertMonthToEnglish(month)}-${day}`;
  }

  let convertedResult = '';
  if (result) {
    // 환율 정보값을 소수점 둘째 자리까지 표시
    const formattedResult = parseFloat(result).toFixed(2);
    // 천단위 콤마 추가
    convertedResult = formattedResult.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

  const handleAmountChange = (event) => {
    let value = event.target.value;
    // 정규식을 사용하여 숫자 또는 소수점만 허용
    value = value.replace(/[^0-9.]/g, '');
    // 소수점을 기준으로 분리하여 정수와 소수 부분을 나눔
    const [integerPart, decimalPart] = value.split('.');
    // 정수 부분에 콤마 추가
    value = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // 소수 부분이 존재할 경우 합치기
    if (decimalPart !== undefined) {
      value += '.' + decimalPart;
    }
    setAmount(value);
  };

  const handleCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    setSelectCurrency(selectedCurrency);
  };

  const handleListCurrency = (selectedCurrency) => {
    setListCurrency(selectedCurrency);
  };

  useEffect(() => {
    const fetchCurrencyData = async () => {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
          "apikey": "aDQdaSClxRk2RT2NlLn88Qc8NlWTXQLx"
        })
      };

      try {
        const response = await fetch(`https://api.apilayer.com/fixer/convert?to=${listCurrency}&from=${selectCurrency}&amount=${amount}`, requestOptions);
        const apiData = await response.json();
        setData(apiData);
        setFromCurrency(apiData.query.from);
        setToCurrency(apiData.query.to);
        setResult(apiData.result);
        setDate(apiData.date)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (amount && selectCurrency && listCurrency) {
      fetchCurrencyData();
    }
  }, [amount, selectCurrency, listCurrency]);

  console.log('amount >> ', amount);
  console.log('selectCurrency >> ', selectCurrency);
  console.log('listCurrency >> ', listCurrency);
  console.log('data >> ', data);
  console.log('fromCurrency >> ', fromCurrency);
  console.log('toCurrency >> ', toCurrency);
  console.log('result >> ', result);
  console.log('date >> ', date);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Converter</h1>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ marginBottom: '10px', display: 'flex' }}>
            <input
              type="text"
              placeholder="금액을 입력하세요."
              value={amount}
              onChange={handleAmountChange}
            />
            <select
              style={{ marginLeft: '10px', width: '150px' }}
              value={selectCurrency}
              onChange={handleCurrencyChange}
            >
              {currencies.map((currencyItem) => (
                <option key={currencyItem} value={currencyItem}>
                  {currencyItem}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '10px' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {currencies.filter((currencyItem) => currencyItem !== selectCurrency).map((currencyItem) => (
                <li
                  key={currencyItem}
                  onClick={() => handleListCurrency(currencyItem)}
                  style={{ display: 'inline-block', marginRight: '2px', cursor: 'pointer', padding: '5px 10px', border: '2px solid white'}}
                >
                  {currencyItem}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{width: '400px', backgroundColor: 'lightgray'}}>
            <p style={{color: '#282C34'}}>{toCurrency} {convertedResult}</p>
            <p style={{color: '#282C34'}}>기준일 : </p>
            <p style={{color: '#282C34'}}>{convertedDate} </p>
        </div>

      </header>
    </div>
  );
}

export default Container;
