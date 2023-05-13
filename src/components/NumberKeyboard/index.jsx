import React, { useEffect, useState, useRef } from 'react';
import { Input, NumberKeyboard, Button, Modal, Empty } from 'antd-mobile';
import './style.less';

const numberUnitList = ['百','千','万','十万','百万','千万','亿','十亿','百亿']

const NumberKeyboardC2 = () => {
    const [value, setValue] = useState(''); // 输入框绑定value
    const [isKeyboardShow, setIsKeyboardShow] = useState(false); // 数字键盘是否展示
    const [numberUnit, setNumberUnit] = useState(''); // 单位
    const [money, setMoney] = useState('3000.01'); // 可用金额
    const [limitMoney, setLimitMoney] =useState(1000); // 限制金额
    
    const inputRef = useRef(); // input方法

    // 处理输入金额长度的单位
    const handleUnit = (length) => {
        const newLength = length - 3;
        let numberUnit;
        if(newLength<0) {
            numberUnit = ''
        }
        if(0 <= newLength && newLength < 9) {
            numberUnit =numberUnitList[newLength]
        }
        if(newLength >= 9) {
            numberUnit = numberUnitList[numberUnitList.length - 1]
        }
        setNumberUnit(numberUnit)
    }

    useEffect(() => {
        handleUnit(value?.length);
    }, [value])

    // 数字键盘输入方法
    const onNumberKeyboardInput = (val) => {
        setValue((data) => {
            if(data[0] === '0') {
                return val
            }
            if(data.length > 0 && Number(data + val) === 0) {
                return data;
            }
           return data + val
        })
    }

    // 数字键盘删除按钮方法
    const onNumberKeyboardDelete = () => {
        setValue((data) => {
            const newData = data.slice(0,data.length-1)
            return newData;
        })
    }

    // 全部提现绑定事件
    const onOperateClick = () => {
        inputRef.current.focus()
        setValue(String(Number(money)))
    }

    const numValue = Number(value);
    const numMoney = Number(money).toFixed(2);
    const isCanClick = numValue && (numValue <= numMoney);

    // 剩余额度描述文本提示
    const descTextRender = () => {
        if(value) {
            if(numValue > numMoney) {
                return <span style={{ color: 'red' }}>
                    超过可用余额（￥{numMoney}）
                </span>
            }

            let newVal = 0
            if(numValue > limitMoney) {
                newVal = ((numValue - limitMoney) / 100).toFixed(2)
            }
            return <span>预计收取服务费
                <span style={{ color: '#000'}}> ￥{newVal}</span>
            </span>
        }
        return <span>免费额度还剩{limitMoney}元，超出部分收取0.1%服务费</span>
    }

    // 自定义确认按钮 
    const ConfirmBtnRender = () => {
        return <Button
            className='ConfirmBtn'
            color={isCanClick && 'primary'}
            disabled={!isCanClick}
            style={{ backgroundColor: !isCanClick ? '#f7f7f7' : '#1677ff', color: !isCanClick && '#a0a0a0'}}
        >
            确认
        </Button>
    }

    // 确认绑定事件
    const onConfirmClick = () => {
        const onClick = () => {
            setValue('');
            if(limitMoney) {
                if(numValue>=limitMoney) {
                    setLimitMoney(0)
                } else {
                    setLimitMoney(limitMoney - numValue)
                }
            }
            setMoney((data) => {
                return (data -  numValue).toFixed(2);
            })
            const storageMoneyList = JSON.parse(window.localStorage.getItem('money')) || []

            if(storageMoneyList.length  >= 3) {
                window.localStorage.setItem(
                    'money', 
                    JSON.stringify([
                        storageMoneyList[storageMoneyList.length - 2], 
                        storageMoneyList[storageMoneyList.length - 1],
                        numValue
                    ])
                )
            } else {
                window.localStorage.setItem('money', JSON.stringify([...storageMoneyList, numValue]))
            }

            setIsKeyboardShow(false)
            Modal.alert({
                content: `提现${numValue}`,
            })
        }
        isCanClick && onClick()
    }

    // 提现记录
    const onRecord = () => {
        const storageMoneyList = JSON.parse(window.localStorage.getItem('money')) || [];
        // 最近三次

        Modal.alert({
            content: <>
                {
                    storageMoneyList.length > 0 ? 
                        <>提现记录
                            {
                                storageMoneyList.map((item, index) => {
                                    return <div key={index} style={{ marginLeft: '10px' }}>￥{item}</div>
                                })
                            }
                        </> : <Empty description='暂无提现记录' />
                }
                
            </>,
            // onConfirm: () => {
            //   console.log('Confirmed')
            // },
        })
    }

    return <div className="Keyboard">
        <div className="Keyboard_input">
            <div className="Keyboard_input_title">
                提现金额
                <Button 
                    fill='none' 
                    color='primary'
                    onClick={onRecord}
                >提现记录</Button>
            </div>
            <div className="Keyboard_inpnt_unit_box">
                {
                    numberUnit && <div className="Keyboard_input_unit">{`| ${numberUnit}`}</div>
                }
            </div>
            
            <div className="Keyboard_input_box">
                <span className="Keyboard_input_￥">￥</span>
                <Input
                    ref={inputRef}
                    className="Keyboard_input_input"
                    // placeholder='请输入金额'
                    value={value}
                    onChange={val => {
                        setValue(val)
                    }}
                    clearable
                    onBlur={() => {
                        setIsKeyboardShow(false)
                    }}
                    onFocus={() => {
                        setIsKeyboardShow(true)
                    }}
                />
                {
                    !value && <div className="Keyboard_input_operate">
                        <Button 
                            className='Keyboard_input_operate_btn'
                            color='primary' 
                            fill='none'
                            size='mini'
                            customKey={'.'}
                            onClick={onOperateClick}
                        >全部提现</Button>
                        <span className='Keyboard_input_operate_money'>
                            ￥{money}
                        </span>
                    </div>
                }
            </div>
            <div className="Keyboard_input_dec">
                {descTextRender()}
            </div>
        </div>

        <NumberKeyboard 
            className="Keyboard_board"
            visible={isKeyboardShow}
            confirmText={<ConfirmBtnRender/>}
            closeOnConfirm
            onConfirm={onConfirmClick}
            showCloseButton={false}
            onInput={onNumberKeyboardInput}
            onDelete={onNumberKeyboardDelete}
        />
    </div>
}

export default NumberKeyboardC2;