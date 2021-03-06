/**
 * LS-8 v2.0 emulator skeleton code
 */

const LD = 0b10011000;
const LDI = 0b10011001;
const PRN = 0b01000011;
const PRA = 0b01000010;
const INC = 0b01111000;
const DEC = 0b01111001;
const MOD = 0b10101100;
const MUL = 0b10101010;
const DIV = 0b10101011;
const ADD = 0b10101000;
const SUB = 0b10101001;
const HLT = 0b00000001;
const PUSH = 0b01001101;
const POP = 0b01001100;
const CALL = 0b01001000;
const RET = 0b00001001;
const JMP = 0b01010000;
const CMP = 0b10100000;
const JEQ = 0b01010001;
const JGT = 0b01010100;
const JLT = 0b01010011;
const JNE = 0b01010010;
const lMask = 1 << 2;
const gMask = 1 << 1;
const eMask = 1 << 0;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
    this.reg[7] = 0xf4;

    // Special-purpose registers
    this.PC = 0; // Program Counter
    this.FL = 0; // Flags

    this.nextIncFlag = true;
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  push(address) {
    this.reg[7]--;
    this.poke(this.reg[7], address);
  }

  pop(address) {
    address = this.ram.read(this.reg[7]);
    this.reg[7]++;
  }

  jumpIfTrue(regA) {
    this.PC = this.reg[regA];
    this.nextIncFlag = false;
  }

  performInstruction(op, regA, regB) {
    this.nextIncFlag = true;
    switch (op) {
      case INC:
      case DEC:
      case MUL:
      case DIV:
      case ADD:
      case SUB:
      case MOD:
      case CMP:
        this.alu(op, regA, regB);
        break;
      case LD:
        this.reg[regA] = this.reg[regB];
        break;
      case LDI:
        this.reg[regA] = regB;
        break;
      case HLT:
        this.stopClock();
        break;
      case PRN:
        console.log(this.reg[regA]);
        break;
      case PRA:
        process.stdout.write(
          String.fromCharCode(this.ram.read(this.reg[regA]))
        );
        break;
      case PUSH:
        this.push(this.reg[regA]); //pushes register input to stack
        break;
      case POP:
        this.pop(this.reg[regA]); //receives to register input from stack
        break;
      case CALL:
        this.push(this.PC + 2);
        this.jumpIfTrue(regA);
        break;
      case RET:
        this.PC = this.ram.read(this.reg[7]);
        this.reg[7]++;
        this.nextIncFlag = false;
        break;
      case JMP:
        this.jumpIfTrue(regA);
        break;
      case JEQ:
        (this.FL & eMask) === 1 ? this.jumpIfTrue(regA) : null;
        break;
      case JNE:
        (this.FL & eMask) === 0 ? this.jumpIfTrue(regA) : null;
        break;
      case JGT:
        (this.FL & gMask) === 1 ? this.jumpIfTrue(regA) : null;
        break;
      case JLT:
        (this.FL & lMask) === 1 ? this.jumpIfTrue(regA) : null;
        break;
      default:
        console.log("Command not recognized", op.toString(2));
        this.stopClock();
    }
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  alu(op, regA, regB) {
    switch (op) {
      case INC:
        this.reg[regA]++;
        break;
      case DEC:
        this.reg[regA]--;
        break;
      case MOD:
        if (this.reg[regB] === 0) {
          console.log("Can't MOD by 0");
          stopClock();
        }
        this.reg[regA] = this.reg[regB] % this.reg[regA];
        break;
      case MUL:
        this.reg[regA] = this.reg[regB] * this.reg[regA];
        break;
      case DIV:
        if (this.reg[regB] === 0) {
          console.log("Can't DIV by 0");
          stopClock();
        }
        this.reg[regA] = this.reg[regB] / this.reg[regA];
        break;
      case ADD:
        this.reg[regA] = this.reg[regB] + this.reg[regA];
        break;
      case SUB:
        this.reg[regA] = this.reg[regB] - this.reg[regA];
        break;
      case CMP:
        this.reg[regA] === this.reg[regB]
          ? (this.FL |= eMask)
          : (this.FL &= ~eMask);
        this.reg[regA] < this.reg[regB]
          ? (this.FL |= lMask)
          : (this.FL &= ~lMask);
        this.reg[regA] > this.reg[regB]
          ? (this.FL |= gMask)
          : (this.FL &= ~gMask);
        break;
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    const IR = this.ram.read(this.PC);

    const operandA = this.ram.read(this.PC + 1);
    const operandB = this.ram.read(this.PC + 2);

    //console.log(IR.toString(2));
    this.performInstruction(IR, operandA, operandB);
    if (this.nextIncFlag) {
      let inc = Number(IR)
        .toString(2)
        .padStart(8, 0)
        .substr(0, 2);
      if (inc === "01") this.PC += 2;
      else if (inc === "10") this.PC += 3;
      else this.PC++;
    }
  }
}

module.exports = CPU;
