function getGamepad(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    const gamepad = gamepads[gamepadIndex];
    if (gamepad === null) {
        throw new Error(`No gamepad has the gamepad index ${gamepadIndex}`);
    }
    return gamepad;
}

function faceButtonPressed(
    gamepads: (Gamepad | null)[], gamepadIndex: number, buttonIndex: number
) {
    return getGamepad(gamepads, gamepadIndex).buttons[buttonIndex].pressed;
}

function aButtonPressed(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return faceButtonPressed(gamepads, gamepadIndex, FaceButton.A);
}

function bButtonPressed(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return faceButtonPressed(gamepads, gamepadIndex, FaceButton.B);
}

function xButtonPressed(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return faceButtonPressed(gamepads, gamepadIndex, FaceButton.X);
}

function yButtonPressed(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return faceButtonPressed(gamepads, gamepadIndex, FaceButton.Y);
}

function bumperPressed(
    gamepads: (Gamepad | null)[], gamepadIndex: number, buttonIndex: number
) {
    return getGamepad(gamepads, gamepadIndex).buttons[4 + buttonIndex].pressed;
}

function leftBumperPressed(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return bumperPressed(gamepads, gamepadIndex, Bumper.LEFT);
}

function rightBumperPressed(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return bumperPressed(gamepads, gamepadIndex, Bumper.RIGHT);
}

function getTriggerState(
    gamepads: (Gamepad | null)[], gamepadIndex: number, id: number
) {
    return getGamepad(gamepads, gamepadIndex).buttons[6 + id];
}

function getLeftTriggerState(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return getTriggerState(gamepads, gamepadIndex, Trigger.LEFT);
}

function getRightTriggerState(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return getTriggerState(gamepads, gamepadIndex, Trigger.RIGHT);
}

function getThumbstickVector(
    gamepads: (Gamepad | null)[], gamepadIndex: number, thumbstickIndex: number
) {
    const axes = getGamepad(gamepads, gamepadIndex).axes;
    return Vector2D.cartesian(
        axes[2 * thumbstickIndex], -axes[2 * thumbstickIndex + 1]
    );
}

function getLeftThumbstickVector(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return getThumbstickVector(gamepads, gamepadIndex, Thumbstick.LEFT);
}

function getRightThumbstickVector(gamepads: (Gamepad | null)[], gamepadIndex: number) {
    return getThumbstickVector(gamepads, gamepadIndex, Thumbstick.RIGHT);
}