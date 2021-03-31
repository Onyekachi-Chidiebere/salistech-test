import React, { useState, useEffect } from 'react';

const EditableStringCell = ({
  value: initialValue,
  row: index,
  updateMyData
}) => {
  const [value, setValue] = useState(initialValue)

  const onChange = e => setValue(e.target.value)
  const onBlur = () => updateMyData(index, value);

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <textarea className='editableText' value={value} onBlur={onBlur} onChange={onChange} />;
};


function App() {
  const [newValue, setNewValue] = useState(null);
  const [error, setError] = useState(false);
  const [list, setList] = useState([
    'I will complete my API consumption by 12 noon today',
    'I will sart the mobile version for the inventory site after lunch today',
  ]);

  const updateMyData = (dataIndex, value) => {
    // go through the old data search for id and replace with current value
    setList(old =>
      old.map((row, index) => {
        if (index === dataIndex)
          return value
        return row;
      })
    );
  };

  const handleAdd = () => {
    // ensure input value is not empty
    if (!newValue)
      return console.log('empty value to store');
    // ensure list item is not more than 10

    if (list.length > 9) {
      setError(true)
      return setTimeout(() => setError(false), 3000);
    }

    setList((oldList) => [newValue, ...oldList]);
    setNewValue('');
  }

  const handleDelete = (value) => {
    let newList = list.filter((listItem) => listItem != value)
    setList((oldList) => oldList.filter((listItem) => listItem != value));
    return setList(newList);
  }

  useEffect(() => {
    // retrieve list from local storage on page refresh
    let oldList = localStorage.getItem("daily_activity_list");
    if (oldList)
      setList(JSON.parse(oldList));
  }, []);

  useEffect(() => {
    // update data in local storage on list update
    localStorage.setItem("daily_activity_list", JSON.stringify(list));
  }, [list]);


  return (
    <div className="body">
      <div className='container'>
        <div className='title'>
          <h2> Kindly add your activities for today</h2>
        </div>
        <div>
          <div className='addActivity'>
            <input onChange={({ target }) => setNewValue(target.value)} value={newValue} />
            <button disabled={!newValue} onClick={handleAdd}>
              <b>Add</b>
            </button>
          </div>
          <div className='errorContainer'>
            <b>
              {error && <i>Sorry you have reached the maximun activity!</i>}
            </b>
          </div>
          {list.map((item) => <div className='activity'>
            <EditableStringCell value={item} updateMyData={updateMyData} row={list.indexOf(item)} />
            <p className='deleteBtn' onClick={() => { handleDelete(item) }}>delete</p>
          </div>)}

        </div>
      </div>
    </div>
  );
}

export default App;
