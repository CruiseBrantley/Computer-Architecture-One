# Basic Computer Engineering

We can't start our study of computers without a brief discussion of
computer engineering. Know what the following words mean:

* *Transistor*: A basic element of computation that controls the flow of electricity, similar to but different than a switch. Transistors are used, among other things, to build _logic gates_.

* *Logic gate* A collection of transistors put together to perform one of the
  basic boolean logic functions on a single bit or a collection of bits. Some of
  these boolean functions are _NOT_, _AND_, _OR_, _XOR_, _NAND_, and _NOR_.

  A _NAND_ gate, for example, is made of two transistors. _NAND_ and _NOR_ gates
  are called _functionally complete_ since they can each be used to build any of
  the other gates.

* *Flip Flop*: A flip flop is a basic memory storage device. It can be used to
  hold _registers_ (below), but main memory is rarely made up of flip flops.


## Boolean Logic

The basic boolean operations are often demonstrated with _truth tables_. A truth
table shows, for a variety of input, what the output of a certain booleans
operation or gate will be.

For example, the _NOT_ gate (also called an _inverter_), has a single input and
a single output. If that input is 1 (or TRUE), then the output is 0 (FALSE).

Here is the truth table for _NOT_ (remember that 0 is FALSE and 1 is TRUE):

| A | NOT A |
|:-:|:-----:|
| 0 |   1   |
| 1 |   0   |

> Quick note: _XOR_ is _exclusive OR_; its result is true if _only one_ of its
> inputs is true. _NAND_ is "not and"; it's an _AND_ gate with a _NOT_ gate on
> the output. _NOR_ is similar, except for _OR_.

The output is the rightmost columns. The other columns on the left are inputs.
You can clearly see that if `A` is `0`, `NOT A` is `1`.

The truth table for other operations are similar, but have two inputs:

| A | B | A AND B | A OR B | A XOR B | A NOR B | A NAND B |
|:-:|:-:|:-------:|:------:|:-------:|:-------:|:--------:|
| 0 | 0 |    0    |   0    |    0    |    1    |    1     |
| 0 | 1 |    0    |   1    |    1    |    0    |    1     |
| 1 | 0 |    0    |   1    |    1    |    0    |    1     |
| 1 | 1 |    1    |   1    |    0    |    0    |    0     |

When you are performing a boolean operation on a multi-bit number, each pair of
bits is considered in isolation. In the following example, we perform a
bitwise-AND on two bytes. We consider the top bit and bottom bit of each
position to determine the result:

```
    1 1 0 1 0 1 1 0
AND 1 1 1 1 0 0 0 0
-------------------
    1 1 0 1 0 0 0 0
```

## Architecture

![Basic Architecture](img/basic-arch.png)

Computers have grown radically in transistor density and clock speed, but the
overall design of your computer has not changed tremendously since the 8086 in
1976 [1](https://en.wikipedia.org/wiki/X86). Modern computers utilized a fixed
component architecture, where separate components can be upgraded, swapped, or
redesigned for the next version with minimal impact on other components. It
helps to visualize these components on a full size ATX form-factor motherboard:

![Image of motherboard](img/motherboard.jpg)
An image of an older motherboard - many of the base components are the same, but
the front size bus is missing on modern motherboards because it is now inside of
the CPU.

![LGA-1151 socket](img/Core_i7_bottom.png)
The pins on the bottom of the CPU that connect it with the rest of the system
components: clock controls, buses, serial interfaces, interrupts, power

![Kaby Lake Quad Core](img/kaby-lake-quad.png)

![Quad core manual diagram](img/quad-core-diagram.png)

[Amazing explanation of Kaby Lake CPU architecture](https://en.wikichip.org/wiki/intel/microarchitectures/kaby_lake)

## Elements of the CPU

CPU, Clock(s), Program Counter, Instruction Register, Arithmetic Logic Unit,
bus(es), RAM, Registers, Operations.

Here is a simplified CPU diagram:

![Simplified CPU diagram](img/simple-cpu.png)

* *CPU*: a general purpose hardware component built with custom hardware to read
  and write memory, perform arithmetic. The CPU executes instructions that are
  stored in memory.

* *Clock*(s): Special pieces of electronics hardware that cause a small voltage
  cycle at an insanely fast speed. Kaby Lake clocks: base, core, ring, IGP,
  eDRAM, Mem

* *Registers*: Small memory locations within the CPU used for retrieving
  instructions, reading and writing memory, and executing commands.

* *Program Counter* (PC): A special register that holds the address of the
  currently-executing instruction. (_Address_ is the index into the memory
  array.) As the program executes, the PC moves from this current instruction to
  the next one.

* *Instruction Register* (IR): A special memory-related register that decodes,
  pipelines, and executes the current instruction (which was read from the
  memory pointed to by the program counter).

* *Arithmetic Logic Unit* (ALU): Part of the CPU that handles basic arithmetic and
  boolean comparisons.

* *Operations* or *Opcodes*: Single numeric values that indicate to the CPU the
  next step or series of steps.

* *Cache*: Memory located inside of the CPU for low latency and high throughput.
  RAM located outside of CPU fundamentally must be slower, because it is so far
  away.

* *Bus*: A set of wires that connects the CPU with other system components such
  as RAM and peripherals. The CPU has internal buses, and modern systems have
  different buses for different components: DMA bus, PCI bus, 

* *RAM*: A grid of bits. This is commonly interacted with as an array of bytes,
  where each byte is 8-bits (thus forming a 2D grid of bits). RAM contains both
  data (as binary numbers) and instructions (as binary numbers).

Reading:

[Bus](https://en.wikipedia.org/wiki/Bus_(computing))

[RAM](https://en.wikipedia.org/wiki/Random-access_memory)

## Interrupting the CPU

Sometimes when the CPU is in the middle of executing instructions, a peripheral
(like an SSD, keyboard, etc.) will complete a previously-assigned task and need
some software to handle the results of that task.

But the CPU is busy working on something else. How does the peripheral get its
attention?

The answer: _interrupts_.

When the periperhal needs attention, it raises voltage on a wire that ultimately
ends up in the CPU. When the CPU is about to execute another instruction, it
looks to see if any of the interrupt lines are raised. If one is, the CPU stops
what it was doing, and begins executing the _interrupt handler_. The handler
takes care of the needs of the peripheral that requested the interrupt in the
first place.

Once the interrupt handler completes, it executes a _return from interrupt_
instruction, and the CPU restores itself to the exact state before the interrupt
occurred. And then continues executing just as it left off. The interrupt is
complete at the point.

Often the CPU disables further interrupts while an interrupt is being handled.

If we didn't have interrupts, the CPU would have to _poll_ the peripherals
periodically to see if they had data ready. This would be inefficient since most
of the time the peripherals wouldn't have anything ready.


### APIC
[Advanced Programmable Interrupt Controller](https://en.wikipedia.org/wiki/Advanced_Programmable_Interrupt_Controller)

## Links

[Instruction Register](https://en.wikipedia.org/wiki/Instruction_register)

[RAM](https://en.wikipedia.org/wiki/Random-access_memory)

[PCE Express](https://en.wikipedia.org/wiki/PCI_Express)

## Exercises

Explain the following to someone in class, or in your house, or on the
phone. If no one is available, any house plant will do.

(The answers to the below questions aren't necessarily in the above text.)

* In industry terms, how many months does it take for the number of transistors
  on a chip to double?

  Moore's law dictates every 18 months.

* Why are registers necessary? Why not use RAM?

registers are much faster than RAM.

* Why is cache useful?

It's a buffer between the slow RAM and the CPU, not as fast as registers but much larger.

* Why are interrupts useful?

So your computer doesn't get hung forever in a loop or so that you can cancel some code midway through.

* What are some examples of interrupts that might occur?

If you have a higher priority task than it is currently working on.

* Describe what a CPU word is.

1 instruction.

* Describe what the system bus is and what size it is.

It's the size of the data throughput that one clock cycle can process, 32 or 64 bit are common now.

* Describe what a CPU instruction is.

Code to tell the CPU to execute a given task.

* Describe what the CPU clock represents.

1 step for the CPU, the time for it to complete 1 cycle.

* Describe what a CPU interrupt is.

A way to transition your CPU from it's current work to another instruction.

* Describe what kinds of pins enter and exit the CPU.

Contacts to the motherboard, LGA or PGA - CPU side or motherboard side.

* Describe what DMA is.

* Say which peripherals are connected to the DMA bus.

* Say which peripherals are connected to the I/O bus.

Mouse, keyboard.

* Describe what L1, L2, and L3 caches are.

All do the same job of being pre-RAM storage, L1 being the fastest, L3 being the slowest. 
They get bigger, cheaper, and slower as you move down the numbers.

* Describe caching and storage from L1 through cloud storage.

L cache is the fastest after registers, but also most expensive and takes up die space.
Then you get to RAM which is slower but *much* more plentiful. - This step and below are volatile and lose memory on power loss.
At this point you reach Solid State storage or Hard drives - much slower than RAM but still local and as such faster than cloud storage.
Cloud Storage is for longer term storage of things you don't want to lose if your computer were to fail
or that you want to use between multiple machines and have access to anywhere. However it would be the slowest because it's stored on a remote server.

* Describe what RAM is and its reponsibility in the system.

RAM is a cache between SSD or HDD and the L Caches

* Describe what the hard disk is and its responsibility in the system.

Longer term storage, things you want to retain when your program stops working or you restart your computer.
Also much larger storage than anything before it in the chain.

* Describe what the network interface card is responsible for in the system.

Connecting your computer to a LAN or WAN - Local connection to other devices or internet connection.

* Describe what the graphics card is responsible for in the system.

Rendering graphics or massively parallel work.

* Suggest the role that graphics cards play in machine learning.

That would fit into the massively parallel work where graphics cards have thousands of cores and each can simulate a "neuron" in machine learning.
