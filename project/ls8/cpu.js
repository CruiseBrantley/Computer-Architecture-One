/**
 * LS-8 v2.0 emulator skeleton code
 */

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

    // Special-purpose registers
    this.PC = 0; // Program Counter
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  convertInstruction(IR) {
    switch (IR.toString(2).padStart(8, 0)) {
      case "10011000":
        IR = "LD";
        break;
      case "10011001":
        IR = "LDI";
        break;
      case "01000011":
        IR = "PRN";
        break;
      case "10101100":
        IR = "MOD";
        break;
      case "10101010":
        IR = "MUL";
        break;
      case "10101011":
        IR = "DIV";
        break;
      case "10101000":
        IR = "ADD";
        break;
      case "10101001":
        IR = "SUB";
        break;
      default:
        IR = "HLT";
    }
    return IR;
  }

  performInstruction(op, regA, regB) {
    switch (op) {
      case "LD":
        this.reg[regA] = this.reg[regB];
        break;
      case "LDI":
        this.reg[regA] = regB;
        break;
      case "MUL":
        this.alu(op, regA, regB);
        break;
      case "DIV":
        this.alu(op, regA, regB);
        break;
      case "ADD":
        this.alu(op, regA, regB);
        break;
      case "SUB":
        this.alu(op, regA, regB);
        break;
      case "MOD":
        this.alu(op, regA, regB);
        break;
      case "HLT":
        this.stopClock();
        break;
      case "PRN":
        console.log(this.reg[regA]);
        break;
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
      case "MOD":
        if (this.reg[regB] === 0) {
          console.log("Can't MOD by 0");
          stopClock();
        }
        this.reg[regA] = this.reg[regB] % this.reg[regA];
        break;
      case "MUL":
        this.reg[regA] = this.reg[regB] * this.reg[regA];
        break;
      case "DIV":
        if (this.reg[regB] === 0) {
          console.log("Can't DIV by 0");
          stopClock();
        }
        this.reg[regA] = this.reg[regB] / this.reg[regA];
        break;
      case "ADD":
        this.reg[regA] = this.reg[regB] + this.reg[regA];
        break;
      case "SUB":
        this.reg[regA] = this.reg[regB] - this.reg[regA];
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

    let IRConverted = this.convertInstruction(IR);

    this.performInstruction(IRConverted, operandA, operandB);

    let inc = Number(IR)
      .toString(2)
      .padStart(8, 0)
      .substr(0, 2);
    if (inc === "01") this.PC += 2;
    else if (inc === "10") this.PC += 3;
    else this.PC++;
  }
}

module.exports = CPU;
