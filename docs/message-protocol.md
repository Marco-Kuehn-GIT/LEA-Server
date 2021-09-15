# Message-Protocol

All messages start with the MSG_TYPE encoded as 8bit number

# MSG_TYPE's
    "AUTH",                         // = 0
    "INIT",                         // = 1
    "CHAT",                         // = 2
    "SPAWN",                        // = ...
    "MOVE",
    "CHANGE_TRANSFORM",
    "ERR"

## AUTH
    <MSG_TYPE><password>
    password: string

## INIT
    <MSG_TYPE>

## CHAT
    <MSG_TYPE><msg>
    msg: string

## SPAWN
    <MSG_TYPE><OBJ_TYPE><OBJ_ID> <positionX> <positionY>
    OBJ_TYPE: byte
    OBJ_ID: int
    positionX: float
    positionY: float

## MOVE
    <MSG_TYPE><positionX> <positionY>
    positionX: float
    positionY: float

## CHANGE_TRANSFORM
    <MSG_TYPE><positionX> <positionY> <rotation> <scaleX> <scaleY>
    positionX: float
    positionY: float
    rotation: float
    scaleX: float
    scaleY: float
