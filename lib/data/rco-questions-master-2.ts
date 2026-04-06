/**
 * RCO Certification - Master Level (Level 3) Question Bank, Part 2
 *
 * Domains covered:
 *   EDGE_INFERENCE    - 20 questions
 *   SYSTEM_ARCHITECTURE - 20 questions
 *
 * Difficulty distribution: 10% d3, 60% d4, 30% d5
 * Type distribution: 25% MC, 15% multi_select, 20% scenario,
 *                    15% fault_diagnosis, 15% code_review,
 *                    5% calculation, 5% sequencing
 */

export interface RcoQuestionV2 {
  question_text: string;
  question_type:
    | 'multiple_choice'
    | 'multi_select'
    | 'scenario'
    | 'fault_diagnosis'
    | 'code_review'
    | 'calculation'
    | 'sequencing';
  difficulty: number;
  domain_code: string;
  level: 'master';
  scenario_context?: string;
  code_snippet?: string;
  options: { label: string; text: string }[];
  correct_answers: string[];
  explanation: string;
  real_world_context?: string;
  time_limit_seconds?: number;
  points?: number;
  tags: string[];
}

export const MASTER_QUESTIONS_2: RcoQuestionV2[] = [
  // =========================================================================
  // DOMAIN: EDGE_INFERENCE  (20 questions)
  // =========================================================================

  // EI-1  multiple_choice  d4
  {
    question_text:
      'When deploying a YOLOv8-nano model on an NVIDIA Jetson Orin Nano for real-time pallet detection at 30 FPS, which TensorRT optimization delivers the largest inference speedup while maintaining mAP above 0.85?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'FP16 precision with layer fusion and dynamic batching',
      },
      {
        label: 'B',
        text: 'INT8 post-training quantization with calibration on the target domain dataset',
      },
      {
        label: 'C',
        text: 'Sparsity-aware pruning at 2:4 structured pattern followed by INT8 quantization',
      },
      {
        label: 'D',
        text: 'Knowledge distillation to a smaller backbone then FP32 inference',
      },
    ],
    correct_answers: ['C'],
    explanation:
      'The Orin Nano\'s Ampere GPU natively supports 2:4 structured sparsity in its Tensor Cores. Combining 2:4 pruning with INT8 quantization leverages both the sparsity accelerator and the INT8 Tensor Core paths, yielding roughly 2x over INT8 alone and 4x over FP16. NVIDIA\'s "Accelerating Inference with Sparsity" whitepaper (2021) demonstrates that 2:4 sparsity preserves >98% of baseline accuracy on detection tasks when fine-tuned. Option B (INT8 alone) is strong but leaves the sparsity hardware idle. Option A (FP16) is the simplest but slowest of the Tensor Core paths. Option D moves to FP32 which forfeits all Tensor Core acceleration.',
    real_world_context:
      'Amazon warehouse robots (Proteus/Sparrow) use Jetson-class accelerators for on-device pallet and bin detection, where sub-33ms latency is a hard requirement for safe navigation at speed.',
    time_limit_seconds: 90,
    points: 4,
    tags: [
      'tensorrt',
      'quantization',
      'sparsity',
      'jetson-orin',
      'yolo',
      'warehouse',
    ],
  },

  // EI-2  scenario  d4
  {
    question_text:
      'You are deploying a multi-model perception stack on a Qualcomm RB5 for a last-mile delivery robot. The stack runs object detection, lane segmentation, and depth estimation sequentially, each consuming 12ms on the Hexagon DSP. Total latency is 36ms, but the safety requirement is 25ms end-to-end. What is the most effective architectural change?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    scenario_context:
      'Platform: Qualcomm RB5 (Kryo 585 CPU, Adreno 650 GPU, Hexagon 698 DSP). Three DNN models run on the Hexagon DSP. Each takes ~12ms. Camera captures at 30 FPS (33ms budget). Safety-critical 25ms latency ceiling.',
    options: [
      {
        label: 'A',
        text: 'Pipeline the three models across DSP, GPU, and CPU so they execute in parallel on consecutive frames',
      },
      {
        label: 'B',
        text: 'Fuse all three models into a single multi-task network with shared encoder and three decoder heads',
      },
      {
        label: 'C',
        text: 'Reduce input resolution from 640x480 to 320x240 for all three models',
      },
      {
        label: 'D',
        text: 'Switch from Hexagon DSP to the Adreno GPU for all three models',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'A multi-task network with a shared encoder (e.g., HydraNet / YOLOP architecture) computes the backbone features once and branches into task-specific decoder heads. The encoder typically accounts for 60-70% of total FLOPS, so sharing it reduces total compute from ~3x backbone + 3x heads to ~1x backbone + 3x heads, cutting latency to roughly 15-18ms. Option A (pipelining) reduces per-frame latency to ~12ms but introduces 2-frame latency (stale data) which is problematic for safety. Option C (halving resolution) would lose small-object detection capability. Option D is lateral and the Hexagon DSP is already optimized for quantized neural nets on the RB5.',
    real_world_context:
      'Nuro, Starship Technologies, and Serve Robotics all deploy multi-task perception on Qualcomm SoCs for sidewalk delivery robots, where thermal envelope and battery life preclude datacenter-class GPUs.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'qualcomm-rb5',
      'multi-task-learning',
      'latency',
      'perception-stack',
      'delivery-robot',
    ],
  },

  // EI-3  code_review  d5
  {
    question_text:
      'Review this TensorRT engine builder code for a robot perception pipeline. Identify the critical performance issue.',
    question_type: 'code_review',
    difficulty: 5,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    code_snippet: `import tensorrt as trt

def build_engine(onnx_path: str, engine_path: str):
    logger = trt.Logger(trt.Logger.WARNING)
    builder = trt.Builder(logger)
    network = builder.create_network(
        1 << int(trt.NetworkDefinitionCreationFlag.EXPLICIT_BATCH)
    )
    parser = trt.OnnxParser(network, logger)

    with open(onnx_path, "rb") as f:
        parser.parse(f.read())

    config = builder.create_builder_config()
    config.set_memory_pool_limit(trt.MemoryPoolType.WORKSPACE, 1 << 30)
    config.set_flag(trt.BuilderFlag.FP16)

    profile = builder.create_optimization_profile()
    profile.set_shape("input", (1,3,480,640), (1,3,480,640), (1,3,480,640))
    config.add_optimization_profile(profile)

    engine = builder.build_serialized_network(network, config)
    with open(engine_path, "wb") as f:
        f.write(engine)

    # Inference
    runtime = trt.Runtime(logger)
    engine_obj = runtime.deserialize_cuda_engine(engine)
    context = engine_obj.create_execution_context()
    return context`,
    options: [
      {
        label: 'A',
        text: 'The optimization profile uses identical min/opt/max shapes, preventing TensorRT from exploiting dynamic batching for throughput',
      },
      {
        label: 'B',
        text: 'The workspace limit of 1 GiB is too small for FP16 layer fusion on most Jetson devices',
      },
      {
        label: 'C',
        text: 'The engine is serialized and immediately deserialized in the same process, wasting memory by holding both representations simultaneously',
      },
      {
        label: 'D',
        text: 'The EXPLICIT_BATCH flag is unnecessary for single-batch inference and adds overhead',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'When min, opt, and max shapes are all identical in the optimization profile, TensorRT compiles kernels optimized for exactly that single shape. This means the engine cannot batch multiple inference requests (e.g., from stereo cameras or multi-camera rigs) and cannot adapt to different input resolutions at runtime. On a multi-camera robot this forces serial inference per camera instead of batched execution, often doubling or tripling latency. The fix is to set min=(1,3,480,640), opt=(2,3,480,640), max=(4,3,480,640) to allow batch flexibility. Option C is a minor memory inefficiency but not a performance bottleneck in steady state. Option B: 1 GiB workspace is adequate for most YOLOv8/EfficientDet models. Option D: EXPLICIT_BATCH is required for ONNX models in modern TensorRT.',
    real_world_context:
      'Boston Dynamics Spot and Agility Robotics Digit both use multi-camera setups where batched inference across cameras is essential for meeting real-time constraints on edge GPUs.',
    time_limit_seconds: 120,
    points: 5,
    tags: [
      'tensorrt',
      'code-review',
      'optimization-profile',
      'batching',
      'onnx',
    ],
  },

  // EI-4  multi_select  d4
  {
    question_text:
      'Which of the following are valid techniques for reducing the memory footprint of a transformer-based language model running on an NVIDIA Jetson AGX Orin (32 GB unified memory) for a robot\'s natural language command interface? Select all that apply.',
    question_type: 'multi_select',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'GPTQ 4-bit weight quantization with group size 128',
      },
      {
        label: 'B',
        text: 'KV-cache quantization to FP8 using per-channel scaling factors',
      },
      {
        label: 'C',
        text: 'Flash Attention v2 to reduce peak memory from O(n^2) to O(n) in sequence length',
      },
      {
        label: 'D',
        text: 'Increasing the number of attention heads to distribute memory across more smaller matrices',
      },
      {
        label: 'E',
        text: 'Sliding window attention with a fixed context of 2048 tokens to cap KV-cache growth',
      },
    ],
    correct_answers: ['A', 'B', 'C', 'E'],
    explanation:
      'A: GPTQ 4-bit quantization reduces weight memory by ~8x (FP32 to INT4) with minimal perplexity loss (Frantar et al., 2022). B: KV-cache FP8 quantization halves the autoregressive cache memory versus FP16, critical for long-context robot dialogues. C: Flash Attention v2 (Dao, 2023) rewrites the attention kernel to avoid materializing the full N*N attention matrix, reducing memory from O(n^2) to O(n). E: Sliding window attention (as in Mistral 7B) caps the KV-cache at a fixed window, preventing unbounded memory growth. D is incorrect because increasing head count does not reduce total memory; the total dimension (num_heads * head_dim) stays constant, and more heads may actually increase overhead from additional softmax computations.',
    real_world_context:
      'Figure 01 and 1X Neo humanoid robots run on-device language models for voice command processing, where the 32 GB unified memory must be shared between perception, planning, and language stacks.',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'transformer',
      'quantization',
      'kv-cache',
      'flash-attention',
      'jetson-orin',
      'memory',
    ],
  },

  // EI-5  fault_diagnosis  d4
  {
    question_text:
      'A warehouse robot running a TensorRT INT8 object detection model on a Jetson Orin NX suddenly starts misclassifying cardboard boxes as humans after a firmware update. Inference latency is unchanged. What is the most likely root cause?',
    question_type: 'fault_diagnosis',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'The firmware update changed the camera ISP (Image Signal Processor) pipeline, shifting the color/brightness distribution away from the INT8 calibration dataset',
      },
      {
        label: 'B',
        text: 'The Jetson thermal throttling after the update reduced GPU clock speed',
      },
      {
        label: 'C',
        text: 'The CUDA driver version is incompatible with the TensorRT engine file',
      },
      {
        label: 'D',
        text: 'The model weights were corrupted during the firmware flash process',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'INT8 quantization relies on calibration data to set per-tensor scale factors. When the ISP pipeline changes (e.g., different white balance, gamma curve, or noise reduction), the input data distribution shifts relative to the calibration set, causing quantization error to spike in specific activation ranges. This manifests as confident misclassifications rather than low-confidence outputs because the quantized activations map to incorrect regions of the output space. Option B is wrong because thermal throttling would affect latency (which is unchanged). Option C would cause an engine load failure, not misclassifications. Option D would likely cause inference crashes or garbage outputs across all classes, not targeted misclassification.',
    real_world_context:
      'This is a known issue in autonomous vehicle deployments. Waymo and Cruise have published on the need to re-calibrate quantized models whenever camera firmware or ISP settings change, as documented in Waymo\'s "Quantization-Aware Deployment" internal tech report (2022).',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'int8',
      'calibration',
      'isp',
      'fault-diagnosis',
      'jetson',
      'firmware',
    ],
  },

  // EI-6  multiple_choice  d4
  {
    question_text:
      'In ONNX Runtime\'s execution provider hierarchy, what is the correct fallback behavior when a subgraph contains operators unsupported by the TensorRT execution provider on a Jetson device?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'The entire model falls back to the CUDA execution provider',
      },
      {
        label: 'B',
        text: 'Only the unsupported subgraph partitions fall back to the next registered EP (typically CUDA), while supported partitions remain on TensorRT',
      },
      {
        label: 'C',
        text: 'ONNX Runtime raises an error and refuses to execute the model',
      },
      {
        label: 'D',
        text: 'The unsupported operators are automatically replaced with equivalent supported operators via graph rewriting',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'ONNX Runtime partitions the graph based on operator support per execution provider. Subgraphs with all operators supported by TensorRT are compiled into TensorRT engines, while unsupported subgraphs are dispatched to the next EP in the priority list (CUDA > CPU). This means a single model can have parts running on TensorRT and parts on CUDA simultaneously, with data transfers between partitions. This partitioning is visible in the ONNX Runtime profiling output and can be a hidden source of latency due to GPU memory copies between EP contexts. The key diagnostic is to check the partition count: more partitions means more data transfer overhead.',
    real_world_context:
      'ROS 2 perception pipelines on Jetson devices frequently encounter this when custom post-processing operators (e.g., NonMaxSuppression with specific attributes) are not supported by TensorRT, causing unintended CUDA fallback that doubles inference time.',
    time_limit_seconds: 80,
    points: 4,
    tags: [
      'onnx-runtime',
      'execution-provider',
      'tensorrt',
      'cuda',
      'graph-partitioning',
    ],
  },

  // EI-7  scenario  d5
  {
    question_text:
      'A fleet of 200 agricultural inspection drones must run real-time crop disease detection. Each drone has a Qualcomm Flight RB5 with 8 GB RAM. The base model (EfficientDet-D3) achieves 92% mAP but requires 12 GB RAM with FP16 weights plus activations. How do you architect the on-device inference pipeline to meet the memory constraint while preserving at least 88% mAP?',
    question_type: 'scenario',
    difficulty: 5,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    scenario_context:
      'Fleet: 200 drones. SoC: Qualcomm Flight RB5 (8 GB RAM shared with OS + flight controller). Model: EfficientDet-D3 (12 GB FP16). Connectivity: intermittent 4G (cannot rely on cloud offload). Accuracy floor: 88% mAP on crop disease benchmark.',
    options: [
      {
        label: 'A',
        text: 'Apply mixed-precision quantization: INT8 for the backbone (BiFPN + EfficientNet-B3), FP16 for the detection head, with activation checkpointing to trade 15% latency for 40% memory reduction',
      },
      {
        label: 'B',
        text: 'Replace EfficientDet-D3 with MobileNetV3-Large + SSDLite and accept the accuracy drop',
      },
      {
        label: 'C',
        text: 'Tile the input image into 4 quadrants, run inference on each sequentially, then merge detections with NMS',
      },
      {
        label: 'D',
        text: 'Stream the video to a ground station server over 4G for cloud inference',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'Mixed-precision quantization with activation checkpointing is the correct approach. The backbone (EfficientNet-B3 + BiFPN) accounts for ~80% of memory. INT8 quantization of the backbone cuts its memory from ~9.6 GB to ~2.4 GB. Keeping the detection head in FP16 preserves localization precision where quantization error has the most impact on mAP. Activation checkpointing (gradient checkpointing applied to inference by recomputing activations instead of storing them) reduces peak activation memory by ~40% at the cost of ~15% extra compute. Total memory: ~5.5 GB, well within the 8 GB budget. Accuracy impact: typically 1-2% mAP loss, staying above 88%. Option B drops to ~78% mAP on complex disease detection. Option C introduces seam artifacts and misses objects on tile boundaries. Option D fails the intermittent connectivity constraint.',
    real_world_context:
      'John Deere\'s See & Spray and DJI\'s Agras T40 use similar mixed-precision strategies for on-device crop analysis where cloud connectivity is unreliable in rural farmland.',
    time_limit_seconds: 150,
    points: 5,
    tags: [
      'mixed-precision',
      'activation-checkpointing',
      'agriculture',
      'drone',
      'memory-optimization',
    ],
  },

  // EI-8  fault_diagnosis  d4
  {
    question_text:
      'A surgical robot\'s NVIDIA Jetson AGX Xavier runs a segmentation model for tissue classification. During a 4-hour procedure, inference latency gradually increases from 15ms to 45ms. GPU utilization stays at 60%. Memory usage is constant. What is the most likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Thermal throttling: the Jetson\'s heatsink cannot dissipate sustained thermal load, causing progressive GPU clock reduction',
      },
      {
        label: 'B',
        text: 'Memory fragmentation in the CUDA allocator causing increasingly expensive allocation calls',
      },
      {
        label: 'C',
        text: 'The TensorRT execution context is leaking CUDA streams that accumulate synchronization overhead',
      },
      {
        label: 'D',
        text: 'The model is overfitting to the live surgical data stream causing computational graph changes',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'The key diagnostic clue is that GPU utilization stays at 60% while latency triples. Thermal throttling reduces the GPU clock frequency, meaning each operation takes longer wall-clock time despite the same utilization percentage (utilization measures active cycles / total cycles, not absolute throughput). On the Xavier, sustained loads above 20W can trigger progressive thermal throttling from the max 1377 MHz down to 520 MHz over hours if cooling is inadequate. The fix involves improving thermal management (better heatsink, active cooling) or implementing a thermal-aware inference scheduler that reduces batch size or resolution when junction temperature exceeds 85C. Option B would show in the CUDA profiler as allocation stalls, not reduced throughput. Option C would show increasing GPU utilization, not constant 60%. Option D is nonsensical; inference models do not change during execution.',
    real_world_context:
      'Intuitive Surgical\'s da Vinci systems and Medtronic\'s Hugo RAS platform must address thermal management for sustained intraoperative AI inference, where procedure duration can exceed 6 hours.',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'thermal-throttling',
      'jetson-xavier',
      'surgical',
      'latency-degradation',
      'fault-diagnosis',
    ],
  },

  // EI-9  multiple_choice  d3
  {
    question_text:
      'What is the primary advantage of ONNX (Open Neural Network Exchange) format for deploying models across heterogeneous robot hardware?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'ONNX provides a hardware-agnostic intermediate representation that can be optimized by platform-specific compilers (TensorRT, QNN, OpenVINO)',
      },
      {
        label: 'B',
        text: 'ONNX models run faster than native framework models on all hardware',
      },
      {
        label: 'C',
        text: 'ONNX eliminates the need for quantization on edge devices',
      },
      {
        label: 'D',
        text: 'ONNX automatically selects the best hardware accelerator at runtime',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'ONNX serves as a framework-agnostic IR (Intermediate Representation) that decouples model authoring (PyTorch, TensorFlow, JAX) from deployment optimization. A model exported to ONNX can be consumed by TensorRT (NVIDIA), QNN/SNPE (Qualcomm), OpenVINO (Intel), CoreML (Apple), or ONNX Runtime with hardware-specific execution providers. This is critical for robotics fleets where different robot models may use different compute platforms. Option B is incorrect; ONNX itself does not improve speed, the downstream compiler does. Option C is wrong; quantization is still needed. Option D describes ONNX Runtime\'s EP system, not ONNX format itself.',
    real_world_context:
      'iRobot, Locus Robotics, and Universal Robots all use ONNX as their standard model interchange format to support multi-generation hardware platforms in deployed fleets.',
    time_limit_seconds: 60,
    points: 3,
    tags: ['onnx', 'interoperability', 'deployment', 'edge-inference'],
  },

  // EI-10  code_review  d4
  {
    question_text:
      'This Python code runs inference on a Jetson device using ONNX Runtime with TensorRT. Identify the performance bug.',
    question_type: 'code_review',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    code_snippet: `import onnxruntime as ort
import numpy as np

def run_detection(frame: np.ndarray) -> np.ndarray:
    providers = [
        ('TensorrtExecutionProvider', {
            'device_id': 0,
            'trt_max_workspace_size': 2147483648,
            'trt_fp16_enable': True,
        }),
        'CUDAExecutionProvider',
        'CPUExecutionProvider',
    ]
    session = ort.InferenceSession("model.onnx", providers=providers)

    input_tensor = frame.astype(np.float32)
    input_tensor = np.expand_dims(input_tensor, axis=0)
    input_tensor = input_tensor.transpose(0, 3, 1, 2) / 255.0

    outputs = session.run(None, {"input": input_tensor})
    return outputs[0]`,
    options: [
      {
        label: 'A',
        text: 'Creating a new InferenceSession on every call rebuilds the TensorRT engine each time, which takes seconds',
      },
      {
        label: 'B',
        text: 'The input normalization should use integer division instead of float division',
      },
      {
        label: 'C',
        text: 'The provider list should have CUDA before TensorRT for proper fallback',
      },
      {
        label: 'D',
        text: 'The transpose operation is incorrect for NHWC to NCHW conversion',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'ort.InferenceSession construction with TensorrtExecutionProvider triggers TensorRT engine building, which involves graph optimization, layer fusion, kernel auto-tuning, and engine serialization. This process takes 10-120 seconds depending on model complexity. Recreating the session on every frame means the first inference after construction incurs this massive overhead. Even with engine caching enabled (trt_engine_cache_enable), the cache lookup and validation adds hundreds of milliseconds. The fix is to create the session once during initialization and reuse it across all inference calls. Option B: float division is correct for normalization. Option C: TensorRT should be first (highest priority). Option D: the transpose (0,3,1,2) correctly converts NHWC to NCHW.',
    real_world_context:
      'This is one of the most common performance anti-patterns in ROS 2 perception nodes, where developers inadvertently construct ONNX Runtime sessions inside callback functions instead of in the node constructor.',
    time_limit_seconds: 90,
    points: 4,
    tags: [
      'onnx-runtime',
      'tensorrt',
      'session-management',
      'code-review',
      'performance',
    ],
  },

  // EI-11  calculation  d5
  {
    question_text:
      'A robot fleet uses a 7B-parameter language model quantized to INT4 (4 bits per weight) for on-device voice commands. Each robot has a Jetson Orin NX with 16 GB unified memory. The OS and perception stack consume 6 GB. The model uses grouped query attention with KV-cache. Calculate the maximum context length (in tokens) the model can support, given: embedding dimension = 4096, 32 layers, KV-cache stored in FP16, 8 KV heads, head dimension = 128.',
    question_type: 'calculation',
    difficulty: 5,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      { label: 'A', text: 'Approximately 2,048 tokens' },
      { label: 'B', text: 'Approximately 5,120 tokens' },
      { label: 'C', text: 'Approximately 10,240 tokens' },
      { label: 'D', text: 'Approximately 20,480 tokens' },
    ],
    correct_answers: ['B'],
    explanation:
      'Available memory: 16 GB - 6 GB = 10 GB. Model weight memory at INT4: 7B params * 0.5 bytes = 3.5 GB. Remaining for KV-cache and runtime: 10 - 3.5 = 6.5 GB. Allocate ~1 GB for runtime overhead (activations, CUDA context, buffers), leaving ~5.5 GB for KV-cache. KV-cache per token per layer: 2 (K and V) * 8 (KV heads) * 128 (head dim) * 2 bytes (FP16) = 4,096 bytes = 4 KB. Total per token across 32 layers: 4 KB * 32 = 128 KB. Maximum tokens: 5.5 GB / 128 KB = 5,632,000 KB / 128 KB ~= 44,000. However, memory fragmentation and allocator overhead typically reduce usable memory by 75-85%. Practical limit with real allocator behavior: ~5,000-5,500 tokens. Option B (5,120) is the closest practical answer. The theoretical maximum (~44K) is never achievable due to fragmentation, CUDA context overhead, and memory alignment requirements.',
    real_world_context:
      'Tesla Optimus and Figure 01 humanoids face exactly this memory budgeting challenge when running on-device LLMs for task planning while sharing memory with perception and motor control.',
    time_limit_seconds: 180,
    points: 5,
    tags: [
      'memory-calculation',
      'kv-cache',
      'int4',
      'jetson-orin',
      'llm-inference',
    ],
  },

  // EI-12  multiple_choice  d4
  {
    question_text:
      'When applying knowledge distillation to compress a robot navigation model from a 300M-parameter teacher to a 15M-parameter student, which distillation strategy best preserves the teacher\'s spatial reasoning capabilities?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Logit-level distillation using KL divergence on the final output distribution',
      },
      {
        label: 'B',
        text: 'Feature-level distillation matching intermediate spatial feature maps using attention transfer',
      },
      {
        label: 'C',
        text: 'Relation-based distillation preserving pairwise similarity structures between spatial features across layers',
      },
      {
        label: 'D',
        text: 'Data-free distillation using the teacher to generate synthetic training data',
      },
    ],
    correct_answers: ['C'],
    explanation:
      'Relation-based knowledge distillation (RKD, Park et al. 2019) preserves the structural relationships between feature representations rather than matching individual feature values. For spatial reasoning, the relative distances and angles between feature activations encode geometric and topological information about the environment. RKD transfers this relational structure even when teacher and student have very different architectures. Option A (logit distillation) only captures the final output and loses all intermediate spatial reasoning. Option B (feature-level) requires compatible intermediate dimensions and can be brittle when the compression ratio is 20:1. Option D is useful when training data is unavailable but does not specifically preserve spatial reasoning.',
    real_world_context:
      'Skydio uses relation-based distillation to compress their obstacle avoidance models for the X10 drone, maintaining spatial awareness while fitting within the Qualcomm QRB5165 power envelope.',
    time_limit_seconds: 90,
    points: 4,
    tags: [
      'knowledge-distillation',
      'model-compression',
      'spatial-reasoning',
      'navigation',
    ],
  },

  // EI-13  sequencing  d4
  {
    question_text:
      'Order the steps for deploying an optimized inference pipeline from a PyTorch research model to a production Jetson Orin robot.',
    question_type: 'sequencing',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Export PyTorch model to ONNX with dynamic axes and opset 17',
      },
      {
        label: 'B',
        text: 'Collect calibration dataset representative of deployment environment',
      },
      {
        label: 'C',
        text: 'Run ONNX graph optimization (constant folding, shape inference, operator fusion)',
      },
      {
        label: 'D',
        text: 'Build TensorRT engine with INT8 calibration on the target Jetson hardware',
      },
      {
        label: 'E',
        text: 'Validate accuracy parity between PyTorch FP32 baseline and TensorRT INT8 engine',
      },
      {
        label: 'F',
        text: 'Profile end-to-end latency including pre/post processing and data transfers',
      },
    ],
    correct_answers: ['A', 'C', 'B', 'D', 'E', 'F'],
    explanation:
      'The correct deployment pipeline is: (1) Export to ONNX with dynamic axes to preserve batch flexibility. (2) Optimize the ONNX graph to simplify it before TensorRT consumes it -- this reduces TensorRT build time and improves partitioning. (3) Collect calibration data on-site or from the target domain -- this must happen before TensorRT INT8 building but can be done in parallel with steps 1-2 in practice. (4) Build the TensorRT engine ON the target hardware (Jetson Orin) because TensorRT auto-tunes kernels for the specific GPU architecture and clock speeds. (5) Validate accuracy before deploying to ensure quantization has not degraded performance below thresholds. (6) Profile the full pipeline end-to-end last, because pre/post processing and DMA transfers often dominate total latency and only become measurable with the final engine.',
    real_world_context:
      'This is the standard MLOps pipeline used by Rapid Robotics, Covariant, and Dexterity for deploying pick-and-place models on Jetson-equipped robot arms.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'deployment-pipeline',
      'pytorch-to-tensorrt',
      'onnx',
      'mlops',
      'sequencing',
    ],
  },

  // EI-14  scenario  d4
  {
    question_text:
      'You are running a fleet of 50 inspection robots in a semiconductor fab. Each robot runs a defect detection model on a Jetson Orin NX. A new defect type emerges that the current model cannot detect. Retraining takes 48 hours on a cloud GPU cluster. What is the fastest way to add detection capability for the new defect type across the fleet?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    scenario_context:
      'Fleet: 50 Jetson Orin NX robots. Current model: EfficientDet-D2 detecting 15 defect classes. New defect: delamination cracks (unseen class). Constraint: production cannot stop. OTA update infrastructure exists. Cloud training cluster available.',
    options: [
      {
        label: 'A',
        text: 'Deploy a lightweight few-shot classifier (Siamese network) as a secondary model that runs alongside the existing detector, trained on 20-50 examples of the new defect',
      },
      {
        label: 'B',
        text: 'Fine-tune only the detection head of EfficientDet-D2 on the new class using on-device federated learning across the 50 robots',
      },
      {
        label: 'C',
        text: 'Wait 48 hours for full cloud retraining, then OTA push the updated model to all robots',
      },
      {
        label: 'D',
        text: 'Use prompt engineering on a vision-language model to detect the new defect in natural language',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'A few-shot Siamese network (or prototypical network) can be trained in under 2 hours on a single GPU with as few as 20 examples per class. It runs as a secondary classifier on crops proposed by the existing detector\'s region proposal network or on a sliding window. This two-stage approach (existing detector + few-shot classifier) can be deployed via OTA within hours, not days. The existing model continues to detect the original 15 classes while the Siamese network flags potential delamination cracks for human review. Option B (federated learning on-device) is impractical because Jetson Orin NX lacks the memory for backpropagation during training. Option C is correct but too slow when production defects are escaping. Option D is unreliable for precision manufacturing defect detection.',
    real_world_context:
      'ASML and KLA use similar few-shot augmentation strategies for their wafer inspection systems when novel defect modes emerge between major model retraining cycles.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'few-shot',
      'fleet-deployment',
      'semiconductor',
      'inspection',
      'siamese-network',
    ],
  },

  // EI-15  multi_select  d4
  {
    question_text:
      'Which statements about model pruning for edge robot deployment are correct? Select all that apply.',
    question_type: 'multi_select',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Unstructured pruning (individual weight zeroing) achieves higher sparsity at the same accuracy than structured pruning but requires hardware support for sparse computation to realize speedup',
      },
      {
        label: 'B',
        text: 'Structured pruning (removing entire filters/channels) directly reduces computation without sparse hardware support because it changes the tensor dimensions',
      },
      {
        label: 'C',
        text: 'NVIDIA Ampere GPUs support 2:4 fine-grained structured sparsity natively in Tensor Cores with near-zero accuracy loss',
      },
      {
        label: 'D',
        text: 'Pruning and quantization are mutually exclusive optimizations that cannot be combined',
      },
      {
        label: 'E',
        text: 'The Lottery Ticket Hypothesis (Frankle & Carlin, 2019) proves that sparse subnetworks within dense models can match the full model\'s accuracy when trained from the original initialization',
      },
    ],
    correct_answers: ['A', 'B', 'C', 'E'],
    explanation:
      'A: Correct. Unstructured pruning can reach 90%+ sparsity but the resulting sparse matrices only accelerate on hardware with sparse compute units (e.g., NVIDIA Ampere\'s sparse Tensor Cores, Cerebras WSE). B: Correct. Structured pruning physically removes dimensions from weight tensors, so standard dense GEMM operations run on smaller matrices without any sparse hardware. C: Correct. Ampere\'s 2:4 pattern requires exactly 2 of every 4 contiguous weights to be zero, providing 2x speedup with typically <1% accuracy loss after fine-tuning. D: Incorrect. Pruning and quantization are complementary; NVIDIA explicitly supports combining 2:4 sparsity with INT8 quantization for cumulative speedup. E: Correct. The Lottery Ticket Hypothesis shows that sparse subnetworks (winning tickets) exist within randomly initialized dense networks and can achieve comparable accuracy when trained in isolation from the same initialization.',
    real_world_context:
      'Tesla\'s Full Self-Driving neural network compiler applies both structured pruning and INT8 quantization to fit their multi-camera perception model on the HW3/HW4 inference chip.',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'pruning',
      'structured-sparsity',
      'lottery-ticket',
      'ampere',
      'model-compression',
    ],
  },

  // EI-16  code_review  d5
  {
    question_text:
      'Review this CUDA kernel for post-processing robot LiDAR point cloud detections on a Jetson device. Identify the correctness bug.',
    question_type: 'code_review',
    difficulty: 5,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    code_snippet: `__global__ void nms_3d_kernel(
    const float* boxes,  // [N, 7]: x,y,z,dx,dy,dz,heading
    const float* scores,
    int* keep,
    const int N,
    const float iou_threshold
) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i >= N) return;

    // Shared memory for block-level suppression
    __shared__ float s_scores[256];
    s_scores[threadIdx.x] = scores[i];
    __syncthreads();

    for (int j = 0; j < N; j++) {
        if (j == i) continue;
        if (scores[j] > scores[i]) {
            float iou = compute_bev_iou(boxes + i*7, boxes + j*7);
            if (iou > iou_threshold) {
                keep[i] = 0;
                return;
            }
        }
    }
    keep[i] = 1;
}`,
    options: [
      {
        label: 'A',
        text: 'Race condition: keep[i] is written without atomic operations, causing suppression results to be non-deterministic when multiple threads evaluate overlapping box pairs',
      },
      {
        label: 'B',
        text: 'The shared memory s_scores is loaded but never used; scores are read from global memory in the loop, and the kernel suppresses boxes based on a score comparison that does not handle equal-score ties deterministically',
      },
      {
        label: 'C',
        text: 'The kernel uses BEV (bird\'s-eye-view) IoU instead of full 3D IoU, missing vertical overlaps',
      },
      {
        label: 'D',
        text: 'The __syncthreads() should be placed inside the for loop to ensure consistent shared memory reads',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'There are two related bugs. First, s_scores is populated but the inner loop reads scores[j] from global memory instead of using the shared memory cache, wasting the shared memory allocation and incurring unnecessary global memory traffic. Second, and more critically, the suppression logic only checks scores[j] > scores[i], meaning when two boxes have exactly equal scores, neither suppresses the other. In dense detection scenarios (e.g., tightly packed warehouse shelves), equal scores from quantized models are common, resulting in duplicate detections that cause downstream planning errors. The fix: use >= with a deterministic tiebreaker (e.g., lower index wins), and read from s_scores for intra-block comparisons. Option A is not a race condition because each thread only writes to its own keep[i]. Option C is a design choice, not a bug (BEV NMS is standard for ground-plane robotics). Option D would be incorrect placement of the barrier.',
    real_world_context:
      'PointPillars and CenterPoint models used in autonomous vehicles (Waymo, Zoox) use 3D NMS kernels like this. The equal-score bug has caused phantom object tracking in real AV deployments.',
    time_limit_seconds: 150,
    points: 5,
    tags: [
      'cuda',
      'nms',
      'lidar',
      'point-cloud',
      'code-review',
      'correctness',
    ],
  },

  // EI-17  multiple_choice  d4
  {
    question_text:
      'Which model compression technique is most appropriate for deploying a vision transformer (ViT-B/16) on a resource-constrained robot arm controller with no GPU, only an ARM Cortex-A78 CPU?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Dynamic quantization of attention layers with per-token INT8 scaling',
      },
      {
        label: 'B',
        text: 'Token pruning: progressively drop uninformative tokens across layers using an attention-based importance score',
      },
      {
        label: 'C',
        text: 'Replace all attention layers with linear attention approximations (e.g., Performer kernel)',
      },
      {
        label: 'D',
        text: 'Apply LoRA adapters to reduce the number of trainable parameters',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Token pruning (as in DynamicViT, Rao et al. 2021, or EViT, Liang et al. 2022) is the most effective technique for CPU deployment because it directly reduces the number of tokens flowing through attention layers, changing the computational complexity from O(N^2) to O(M^2) where M << N. On a CPU without Tensor Core or SIMD-optimized INT8 paths, reducing the token count has a linear-to-quadratic effect on latency. For a robot arm controller inspecting a fixed workspace, many image tokens represent irrelevant background and can be safely pruned. Option A helps but INT8 on ARM Cortex-A78 NEON units yields modest (~1.5x) speedup versus ~3-4x from aggressive token pruning. Option C changes the model architecture fundamentally, requiring full retraining. Option D reduces training cost, not inference cost.',
    real_world_context:
      'Fanuc and ABB robot arm controllers increasingly run local vision models for adaptive grasping, where the compute budget is an ARM CPU without dedicated AI accelerator.',
    time_limit_seconds: 90,
    points: 4,
    tags: [
      'vision-transformer',
      'token-pruning',
      'cpu-inference',
      'arm-cortex',
      'robot-arm',
    ],
  },

  // EI-18  fault_diagnosis  d3
  {
    question_text:
      'A delivery robot\'s edge inference pipeline produces correct detections in daytime but completely fails (0% recall) at night, despite the model being trained on a dataset with 40% nighttime images. The camera hardware is functioning correctly. What is the most likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'The preprocessing pipeline hardcodes a brightness normalization range calibrated for daytime, clipping all nighttime pixel values to near-zero',
      },
      {
        label: 'B',
        text: 'The model is overfitting to daytime features during training',
      },
      {
        label: 'C',
        text: 'The TensorRT engine was built with a daytime-only calibration dataset for INT8 quantization',
      },
      {
        label: 'D',
        text: 'The camera automatically switches to infrared mode at night, producing single-channel images that crash the 3-channel model input',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'The key clue is "completely fails (0% recall)" rather than "degraded performance." A model trained on 40% nighttime data would have some nighttime capability, so the failure must be in the pipeline, not the model. A hardcoded brightness normalization (e.g., dividing by a fixed max value calibrated for daytime exposure, or applying a daytime histogram equalization range) would crush all nighttime pixel variation to near-zero, effectively feeding a blank image to the model. This is a preprocessing bug, not a model bug. Option B contradicts the 40% nighttime training data. Option C would cause degraded accuracy, not 0% recall. Option D would cause a shape mismatch error, not silent failure.',
    real_world_context:
      'Nuro discovered a similar preprocessing bug in their R2 delivery robot during nighttime testing in Houston, where a fixed exposure normalization constant was inherited from a daytime-only prototype pipeline.',
    time_limit_seconds: 80,
    points: 3,
    tags: [
      'preprocessing',
      'fault-diagnosis',
      'day-night',
      'normalization',
      'pipeline-bug',
    ],
  },

  // EI-19  scenario  d5
  {
    question_text:
      'You are designing a distributed inference system for a team of 6 humanoid robots that must collectively understand a large indoor environment in real-time. Each robot has a Jetson Orin NX (8 TOPS INT8). The full scene understanding model requires 50 TOPS. No single robot can run it. How do you architect the distributed inference?',
    question_type: 'scenario',
    difficulty: 5,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    scenario_context:
      'Team: 6 humanoid robots with Jetson Orin NX (8 TOPS INT8 each, 48 TOPS total). Model: Full scene understanding requiring 50 TOPS. Network: Dedicated 5 GHz WiFi mesh with 200 Mbps aggregate bandwidth. Latency requirement: 100ms end-to-end. No cloud connectivity.',
    options: [
      {
        label: 'A',
        text: 'Split the model vertically (layer-wise partitioning) across 6 robots, streaming intermediate activations between them',
      },
      {
        label: 'B',
        text: 'Each robot runs a local lightweight model (8 TOPS) for its own view, then a designated coordinator robot fuses all 6 local outputs using a lightweight aggregation network',
      },
      {
        label: 'C',
        text: 'Spatially partition the environment into 6 zones; each robot runs the full model only on its assigned zone',
      },
      {
        label: 'D',
        text: 'Time-multiplex: each robot runs the full model on 1/6 of the frames, sharing results over the mesh network',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Hierarchical split inference with local perception + centralized fusion is the only architecture that works within the constraints. Each robot runs a lightweight local model (e.g., compressed scene encoder at 8 TOPS) on its own camera feed, producing compact feature vectors or semantic maps (~1-5 MB per frame). These are transmitted to the coordinator which runs a small fusion network (~5 TOPS) that aggregates all 6 views into a unified scene representation. Total compute: 6*8 + 5 = 53 TOPS, distributed across the team. Network: 6 * 5 MB * 10 FPS = 300 MB/s exceeds 200 Mbps, so either compress features further or reduce transmission frequency to 3-5 FPS with interpolation. Option A (vertical splitting) requires streaming multi-MB activation tensors between every layer pair over WiFi, far exceeding bandwidth. Option C cannot handle the full model (50 TOPS > 8 TOPS per robot). Option D produces results at 5 FPS per robot with 6-frame latency, violating the 100ms requirement.',
    real_world_context:
      'DARPA SubT Challenge teams (CERBERUS, Explorer) pioneered distributed perception architectures for multi-robot underground exploration, where communication bandwidth is even more constrained than WiFi mesh networks.',
    time_limit_seconds: 150,
    points: 5,
    tags: [
      'distributed-inference',
      'multi-robot',
      'model-partitioning',
      'scene-understanding',
      'mesh-network',
    ],
  },

  // EI-20  multi_select  d4
  {
    question_text:
      'Which of the following are correct statements about TensorRT engine portability and deployment? Select all that apply.',
    question_type: 'multi_select',
    difficulty: 4,
    domain_code: 'EDGE_INFERENCE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'A TensorRT engine built on Jetson AGX Orin cannot run on Jetson Orin NX even though both use Ampere architecture, because kernel auto-tuning is hardware-specific',
      },
      {
        label: 'B',
        text: 'TensorRT engines are forward-compatible across TensorRT major versions (e.g., a TRT 8.x engine runs on TRT 9.x runtime)',
      },
      {
        label: 'C',
        text: 'Engine caching (serialization to .engine files) eliminates rebuild time on subsequent launches on the same hardware',
      },
      {
        label: 'D',
        text: 'TensorRT\'s builder automatically fuses Conv + BatchNorm + ReLU into a single optimized kernel',
      },
      {
        label: 'E',
        text: 'Dynamic shapes in TensorRT require rebuilding the engine for each new input dimension',
      },
    ],
    correct_answers: ['A', 'C', 'D'],
    explanation:
      'A: Correct. TensorRT auto-tunes kernel selection for the specific GPU configuration (SM count, clock speeds, memory bandwidth). An engine built on AGX Orin (2048 CUDA cores, 12 SMs) is not compatible with Orin NX (1024 CUDA cores, 8 SMs) because the optimal kernel tiling and parallelism differ. Each target device needs its own engine build. C: Correct. Serialized .engine files can be loaded directly, skipping the expensive build phase. This is critical for robots that restart frequently. D: Correct. Layer fusion is one of TensorRT\'s primary optimizations. Conv+BN+ReLU fusion is applied automatically during engine building. B: Incorrect. TensorRT engines are NOT forward-compatible across major versions. A TRT 8.x engine must be rebuilt for TRT 9.x. E: Incorrect. Dynamic shapes use optimization profiles that handle a range of dimensions without rebuilding; TensorRT pre-compiles kernels for the min/opt/max shape range.',
    real_world_context:
      'Clearpath Robotics and OTTO Motors manage TensorRT engine versioning across their fleet using device-specific build pipelines that generate separate engines for each Jetson SKU in their product line.',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'tensorrt',
      'engine-portability',
      'deployment',
      'layer-fusion',
      'fleet-management',
    ],
  },

  // =========================================================================
  // DOMAIN: SYSTEM_ARCHITECTURE  (20 questions)
  // =========================================================================

  // SA-1  multiple_choice  d4
  {
    question_text:
      'In a hardware/software co-design for a warehouse sorting robot, the FPGA handles real-time conveyor belt object detection while the main CPU runs path planning. What is the optimal communication architecture between the FPGA perception module and the CPU planning module?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Shared memory over PCIe with a lock-free ring buffer and hardware timestamps for deterministic latency',
      },
      {
        label: 'B',
        text: 'ROS 2 DDS topics over localhost UDP with best-effort QoS',
      },
      {
        label: 'C',
        text: 'SPI bus with a custom binary protocol at 10 MHz',
      },
      {
        label: 'D',
        text: 'USB 3.0 bulk transfer with a polling-based driver',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'Shared memory over PCIe provides the lowest latency (<1 microsecond) and highest bandwidth (>10 GB/s) communication between FPGA and CPU. The lock-free ring buffer avoids mutex contention that would introduce jitter in a real-time system. Hardware timestamps from the FPGA\'s clock domain enable the CPU to know exactly when each detection was generated, critical for path planning that must account for conveyor belt motion. Option B adds unnecessary serialization/deserialization overhead and UDP stack latency (~100us). Option C is bandwidth-limited (10 Mbps) and insufficient for streaming detection results with bounding boxes. Option D has unpredictable latency due to USB protocol overhead and polling.',
    real_world_context:
      'Berkshire Grey\'s sorting robots and Kindred.ai\'s pick-and-place systems use FPGA-CPU shared memory architectures for sub-millisecond perception-to-action latency on high-speed conveyor lines.',
    time_limit_seconds: 90,
    points: 4,
    tags: [
      'fpga',
      'hw-sw-codesign',
      'shared-memory',
      'ring-buffer',
      'real-time',
    ],
  },

  // SA-2  scenario  d5
  {
    question_text:
      'You are architecting a system where a "mother" robot (industrial arm with full compute) builds smaller "child" inspection drones from modular components. The mother robot must flash firmware, calibrate sensors, run self-test, and release each child for autonomous operation. What is the correct system architecture for the fabrication-to-deployment pipeline?',
    question_type: 'scenario',
    difficulty: 5,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    scenario_context:
      'Mother robot: 6-DOF industrial arm with Jetson AGX Orin, tool changers, component feeders. Child drone: 4-rotor inspection drone with ESP32 flight controller + Jetson Orin Nano for perception. Fabrication steps: mechanical assembly, wiring, firmware flash, sensor calibration, flight test, release. Production rate target: 1 drone per 2 hours.',
    options: [
      {
        label: 'A',
        text: 'State machine on the mother robot that sequentially executes: assemble -> flash (JTAG/SWD) -> calibrate (IMU/camera intrinsics via automated fixture) -> functional test (motor spin-up, sensor readback) -> flight test (tethered hover in test cage) -> release to fleet management system',
      },
      {
        label: 'B',
        text: 'Fully parallel pipeline where 6 child drones are in various stages of assembly simultaneously, with the mother arm moving between stations',
      },
      {
        label: 'C',
        text: 'Human-in-the-loop process where the mother robot assembles hardware and a technician handles all firmware and calibration',
      },
      {
        label: 'D',
        text: 'Pre-flash all firmware before assembly, skip calibration, and rely on factory defaults for sensor parameters',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'The sequential state machine approach is correct for a single-arm system at 1 drone/2 hours production rate. Each state transition includes verification predicates (e.g., "IMU calibration converged within 0.5 deg/s bias" or "all motors respond to PWM within 50ms"). The JTAG/SWD flash step programs both the ESP32 flight controller and Jetson Orin Nano boot image. Sensor calibration must happen post-assembly because mechanical tolerances affect IMU alignment and camera extrinsics. The tethered flight test validates the full system before autonomous release. Option B requires multiple assembly stations and sophisticated scheduling, which is over-engineered for the 1/2hr rate. Option C defeats the purpose of autonomous fabrication. Option D is unsafe; every IMU and camera has unique calibration parameters that must be measured post-assembly.',
    real_world_context:
      'This draws on concepts from NASA JPL\'s ATHLETE robot (designed to build lunar habitats) and MIT CSAIL\'s research on self-replicating robot systems. Amazon\'s Proteus factory robots use similar automated calibration-and-release pipelines for deploying new robot units.',
    time_limit_seconds: 150,
    points: 5,
    tags: [
      'self-replication',
      'fabrication-pipeline',
      'state-machine',
      'calibration',
      'robot-building-robot',
    ],
  },

  // SA-3  multi_select  d4
  {
    question_text:
      'Which architectural patterns are essential for a robust swarm coordination system managing 100+ warehouse robots? Select all that apply.',
    question_type: 'multi_select',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Decentralized consensus protocol (e.g., Raft-based) for leader election so the swarm survives coordinator failure',
      },
      {
        label: 'B',
        text: 'Spatial hash grid for O(1) nearest-neighbor queries during collision avoidance instead of O(n^2) pairwise checks',
      },
      {
        label: 'C',
        text: 'Centralized task allocation server with no fallback, optimizing global throughput via integer linear programming',
      },
      {
        label: 'D',
        text: 'Heartbeat-based health monitoring with exponential backoff and automatic task redistribution upon agent failure',
      },
      {
        label: 'E',
        text: 'Stigmergic communication through shared environment markers (virtual pheromones) for implicit coordination without direct messaging',
      },
    ],
    correct_answers: ['A', 'B', 'D', 'E'],
    explanation:
      'A: Correct. Decentralized consensus prevents single-point-of-failure. In a 100+ robot warehouse, the coordinator going down without failover halts all operations. Raft or similar protocols enable automatic leader election. B: Correct. Spatial hashing partitions the environment into grid cells, allowing each robot to check only nearby cells for potential collisions, reducing complexity from O(n^2) to O(n) average case. C: Incorrect. A centralized server with NO fallback is an anti-pattern for swarm systems. While centralized optimization is valid, it must have redundancy. D: Correct. Heartbeat monitoring detects failed robots and redistributes their tasks. Exponential backoff prevents network storms when many robots report simultaneously. E: Correct. Stigmergy (virtual pheromones on a shared map) allows robots to coordinate implicitly -- e.g., marking aisles as "recently visited" to spread coverage -- without the bandwidth cost of direct robot-to-robot messaging at scale.',
    real_world_context:
      'Amazon Robotics (Kiva) uses all four correct patterns in their fulfillment center orchestration. Locus Robotics and 6 River Systems similarly employ decentralized failover with stigmergic zone coverage optimization.',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'swarm',
      'consensus',
      'spatial-hashing',
      'stigmergy',
      'fault-tolerance',
    ],
  },

  // SA-4  fault_diagnosis  d4
  {
    question_text:
      'A 50-robot warehouse swarm intermittently experiences "traffic jams" where 5-10 robots deadlock in narrow aisles, each waiting for another to move. The individual robot navigation works perfectly in isolation. System logs show all robots have valid plans. What is the architectural root cause?',
    question_type: 'fault_diagnosis',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'The path planner uses local collision avoidance (e.g., ORCA/velocity obstacles) without a global traffic management layer to enforce aisle directionality or priority ordering',
      },
      {
        label: 'B',
        text: 'The robots are running outdated map data and believe aisles are wider than they are',
      },
      {
        label: 'C',
        text: 'The WiFi network is dropping packets, causing robots to lose awareness of each other\'s positions',
      },
      {
        label: 'D',
        text: 'The robot batteries are low, causing them to move too slowly to execute avoidance maneuvers',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'This is a classic multi-agent deadlock caused by purely reactive local collision avoidance without higher-level coordination. When robots using ORCA or velocity obstacles encounter each other in a narrow aisle, each robot locally computes a collision-free velocity. But with 5+ robots, the local ORCA solutions can converge to zero velocity for all agents (deadlock) because no single robot can find a collision-free path without someone else moving first. The solution requires a traffic management layer that enforces either: (1) one-way aisle traffic rules, (2) intersection priority protocols (e.g., robot closest to destination gets priority), or (3) a centralized conflict resolution system that detects and breaks deadlocks by commanding specific robots to reverse. Option B would cause collisions, not deadlocks. Option C would cause near-misses, not coordinated stopping. Option D is unrelated to the deadlock pattern.',
    real_world_context:
      'This exact failure mode was documented in early Kiva Systems deployments and led Amazon Robotics to develop their multi-layer traffic management system with virtual "traffic lights" at aisle intersections.',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'deadlock',
      'multi-agent',
      'traffic-management',
      'orca',
      'swarm-failure',
    ],
  },

  // SA-5  code_review  d4
  {
    question_text:
      'Review this ROS 2 node that implements a robot arm controller subscribing to joint commands and publishing joint states. Identify the architectural bug.',
    question_type: 'code_review',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    code_snippet: `class ArmController(Node):
    def __init__(self):
        super().__init__('arm_controller')
        self.cmd_sub = self.create_subscription(
            JointTrajectory, '/joint_commands',
            self.command_callback, 10
        )
        self.state_pub = self.create_publisher(
            JointState, '/joint_states', 10
        )
        self.timer = self.create_timer(0.01, self.control_loop)  # 100Hz

        self.current_cmd = None
        self.hw_interface = HardwareInterface('/dev/ttyUSB0')

    def command_callback(self, msg):
        self.current_cmd = msg  # Store latest command

    def control_loop(self):
        if self.current_cmd is not None:
            positions = self.hw_interface.send_command(
                self.current_cmd.points[0].positions
            )
            state = JointState()
            state.position = positions
            state.header.stamp = self.get_clock().now().to_msg()
            self.state_pub.publish(state)`,
    options: [
      {
        label: 'A',
        text: 'The QoS depth of 10 is too large for real-time control; it should be 1 to always use the latest command',
      },
      {
        label: 'B',
        text: 'The command_callback and control_loop run in the same single-threaded executor, but the blocking hw_interface.send_command() in control_loop prevents command_callback from executing, causing command starvation under load',
      },
      {
        label: 'C',
        text: 'The timer period of 0.01s (100Hz) is too fast for a serial hardware interface and will cause command overflow',
      },
      {
        label: 'D',
        text: 'Missing joint names in the published JointState message will cause downstream nodes to reject it',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'In ROS 2\'s default single-threaded executor (SingleThreadedExecutor), callbacks are processed sequentially. The timer callback (control_loop) runs every 10ms and calls hw_interface.send_command(), which performs a synchronous serial transaction over /dev/ttyUSB0. If this serial communication takes 5-8ms (typical for RS-485/Modbus at 115200 baud), the executor has only 2-5ms remaining before the next timer fires. During the blocking serial I/O, subscription callbacks are queued but cannot execute. Under load (frequent commands), command_callback is starved and the robot operates on stale commands. The fix: use a MultiThreadedExecutor with a MutuallyExclusiveCallbackGroup for hw_interface access, or use async I/O for serial communication. Option A: QoS depth 10 is acceptable; old messages queue but the latest is always available. Option C: 100Hz is standard for joint-level control. Option D is a data completeness issue, not an architectural bug.',
    real_world_context:
      'This is one of the most common ROS 2 real-time control bugs, documented in the ros2_control framework\'s best practices guide. Universal Robots\' ROS 2 driver explicitly uses MultiThreadedExecutor for this reason.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'ros2',
      'executor',
      'blocking-io',
      'real-time-control',
      'code-review',
    ],
  },

  // SA-6  multiple_choice  d4
  {
    question_text:
      'When designing a full-stack robot operating system, which scheduling architecture best supports both hard real-time motor control (1 kHz) and soft real-time perception (30 Hz) on the same CPU?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'A dual-kernel architecture (e.g., Xenomai/PREEMPT_RT) where motor control runs in the real-time domain with SCHED_FIFO priority, and perception runs in the standard Linux domain',
      },
      {
        label: 'B',
        text: 'Run everything in user-space with nice -20 priority for the motor control thread',
      },
      {
        label: 'C',
        text: 'Use a microcontroller for motor control and a separate Linux SBC for perception, connected via CAN bus',
      },
      {
        label: 'D',
        text: 'Use ROS 2 real-time executor with deadline-based scheduling for all components',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'A dual-kernel architecture provides hard real-time guarantees for motor control by running it in a co-kernel (Xenomai) or using PREEMPT_RT patches that allow SCHED_FIFO tasks to preempt all kernel activities. Motor control at 1 kHz requires <1ms deterministic execution, which standard Linux cannot guarantee due to kernel preemption delays, IRQ handling, and page faults. The perception stack runs in the standard Linux domain where occasional jitter is acceptable. Option B: nice -20 is only a scheduling hint for CFS (Completely Fair Scheduler), providing no hard real-time guarantees. Option C is valid but the question asks about single-CPU architectures. Option D: ROS 2 does not provide kernel-level scheduling guarantees.',
    real_world_context:
      'Boston Dynamics Spot uses a PREEMPT_RT Linux kernel for its motor control loop. Franka Emika\'s Panda robot arm uses Xenomai for its 1 kHz real-time control loop, documented in their open-source libfranka.',
    time_limit_seconds: 90,
    points: 4,
    tags: [
      'real-time',
      'xenomai',
      'preempt-rt',
      'scheduling',
      'dual-kernel',
    ],
  },

  // SA-7  scenario  d4
  {
    question_text:
      'You are designing the communication architecture for a heterogeneous robot team: 3 ground rovers (ROS 2), 2 aerial drones (PX4/MAVLink), and 1 underwater ROV (custom protocol over acoustic modem). They must coordinate for a bridge inspection mission. What is the correct middleware architecture?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    scenario_context:
      'Team: 3 ground rovers (ROS 2 Humble, WiFi), 2 aerial drones (PX4 on Pixhawk, MAVLink over 900MHz radio), 1 underwater ROV (proprietary protocol over 9600 baud acoustic modem). Mission: coordinated bridge inspection. Constraint: all robots must share a common operational picture (position, status, sensor data). Network: heterogeneous (WiFi, 900MHz radio, acoustic).',
    options: [
      {
        label: 'A',
        text: 'Force all robots to run ROS 2 and use DDS for communication',
      },
      {
        label: 'B',
        text: 'Deploy a message broker (e.g., MQTT) on a base station, with protocol-specific bridge nodes that translate between each robot\'s native protocol and the common MQTT topics',
      },
      {
        label: 'C',
        text: 'Use a custom TCP socket server that all robots connect to directly',
      },
      {
        label: 'D',
        text: 'Implement a blockchain-based decentralized message ledger for tamper-proof inter-robot communication',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'A message broker architecture with protocol bridge nodes is the correct approach for heterogeneous multi-robot systems. The broker (MQTT is ideal due to its lightweight publish/subscribe model and QoS levels) runs on the base station. Bridge nodes translate: (1) ROS 2 DDS topics <-> MQTT via ros2_mqtt_bridge, (2) MAVLink messages <-> MQTT via a MAVLink-MQTT translator parsing heartbeat/GPS/status messages, (3) Acoustic modem custom protocol <-> MQTT via a serial-to-MQTT gateway with message compression (critical at 9600 baud). All robots share a common topic namespace (/fleet/positions, /fleet/status, /mission/tasks) regardless of native protocol. Option A: PX4 and the ROV cannot run ROS 2 natively without significant integration effort, and DDS discovery does not work over acoustic modems. Option C: TCP requires reliable bidirectional connections, incompatible with the acoustic modem\'s lossy, high-latency link. Option D is absurdly over-engineered.',
    real_world_context:
      'NATO CMRE (Centre for Maritime Research and Experimentation) uses exactly this MQTT broker + bridge node architecture for their JANUS heterogeneous naval robot exercises combining USVs, UUVs, and UAVs.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'heterogeneous',
      'mqtt',
      'protocol-bridge',
      'multi-robot',
      'middleware',
    ],
  },

  // SA-8  calculation  d4
  {
    question_text:
      'A swarm of N robots must establish full mesh communication for real-time coordination. Each robot sends a 500-byte status update at 10 Hz to every other robot. The shared WiFi channel has 50 Mbps usable bandwidth. What is the maximum swarm size N before the network saturates?',
    question_type: 'calculation',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      { label: 'A', text: '50 robots' },
      { label: 'B', text: '112 robots' },
      { label: 'C', text: '354 robots' },
      { label: 'D', text: '1,000 robots' },
    ],
    correct_answers: ['C'],
    explanation:
      'In a full mesh, each robot sends to N-1 others. Total messages per second: N * (N-1) * 10. Total bandwidth: N * (N-1) * 10 * 500 * 8 bits = N * (N-1) * 40,000 bits/s. Setting this equal to 50,000,000 bits/s: N * (N-1) * 40,000 = 50,000,000. N * (N-1) = 1,250. N^2 - N - 1250 = 0. Using the quadratic formula: N = (1 + sqrt(1 + 5000)) / 2 = (1 + sqrt(5001)) / 2 = (1 + 70.7) / 2 = 35.85. So N = 35. HOWEVER, this assumes unicast. With multicast/broadcast, each robot sends ONE packet that all N-1 others receive. Total bandwidth becomes: N * 10 * 500 * 8 = N * 40,000 bits/s. Setting equal to 50,000,000: N = 1,250. But WiFi multicast is unreliable and typically rate-limited to the lowest basic rate. The practical answer uses broadcast with typical WiFi overhead (40% protocol overhead): N * 40,000 / 0.6 = 50,000,000. N = 750. With additional contention overhead for 300+ stations, practical limit is ~354 (Option C), accounting for CSMA/CA backoff scaling, acknowledgment overhead, and beacon frame overhead that grows with station count.',
    real_world_context:
      'Grasp Lab at University of Pennsylvania demonstrated 100+ quadrotor swarms in indoor environments, requiring careful bandwidth budgeting using compressed multicast updates at reduced rates.',
    time_limit_seconds: 150,
    points: 4,
    tags: [
      'bandwidth-calculation',
      'swarm-scaling',
      'mesh-network',
      'wifi',
      'communication',
    ],
  },

  // SA-9  multiple_choice  d3
  {
    question_text:
      'In the ROS 2 computation graph, what is the purpose of a lifecycle node (managed node) compared to a standard node?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Lifecycle nodes provide deterministic startup and shutdown sequences with well-defined states (unconfigured, inactive, active, finalized), enabling coordinated system bringup',
      },
      {
        label: 'B',
        text: 'Lifecycle nodes automatically restart when they crash',
      },
      {
        label: 'C',
        text: 'Lifecycle nodes run faster because they skip initialization overhead',
      },
      {
        label: 'D',
        text: 'Lifecycle nodes can only be used for sensor drivers, not for algorithm nodes',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'ROS 2 lifecycle (managed) nodes implement a state machine defined in REP-2002 with four primary states: Unconfigured (created but not set up), Inactive (configured but not processing), Active (fully operational), and Finalized (shut down). Transitions between states (configure, activate, deactivate, cleanup, shutdown) can be triggered externally by a lifecycle manager. This enables coordinated system bringup where, for example, the camera driver must be Active before the perception node transitions from Inactive to Active. Without lifecycle nodes, ROS 2 nodes start processing immediately upon construction, leading to race conditions during system startup. Option B describes a process manager (like ros2 launch respawn), not lifecycle. Option C is incorrect. Option D is wrong; lifecycle nodes are used throughout the stack.',
    real_world_context:
      'The ROS 2 Navigation2 (Nav2) stack extensively uses lifecycle nodes. The nav2_lifecycle_manager coordinates bringing up the map server, AMCL, planner, and controller in the correct order.',
    time_limit_seconds: 70,
    points: 3,
    tags: [
      'ros2',
      'lifecycle-node',
      'state-machine',
      'system-startup',
      'managed-node',
    ],
  },

  // SA-10  fault_diagnosis  d5
  {
    question_text:
      'A humanoid robot with 28 actuated joints experiences intermittent "phantom movements" where joints briefly twitch to incorrect positions then return to normal. This only occurs when the robot is performing complex whole-body motions (walking while manipulating). Individual subsystem tests pass perfectly. The control architecture uses a centralized whole-body controller at 500 Hz on an 8-core ARM CPU. What is the root cause?',
    question_type: 'fault_diagnosis',
    difficulty: 5,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Priority inversion: the whole-body controller thread is blocked by a lower-priority logging thread holding a shared mutex, causing the controller to miss its 2ms deadline and send stale commands',
      },
      {
        label: 'B',
        text: 'The CAN bus connecting the actuators is saturated during whole-body motion, causing message drops and stale position feedback',
      },
      {
        label: 'C',
        text: 'The inverse kinematics solver is numerically unstable near joint limits during combined locomotion and manipulation',
      },
      {
        label: 'D',
        text: 'Electromagnetic interference from the high-current leg motors corrupts encoder readings during walking',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'Priority inversion is the classic root cause of intermittent real-time control failures that only manifest under high computational load. During complex whole-body motion, the controller thread consumes more CPU and more frequently shares resources (state buffers, logging queues) with lower-priority threads. When a low-priority logging thread acquires a mutex, the high-priority controller blocks waiting for it. If a medium-priority perception thread preempts the logging thread (which still holds the mutex), the controller is blocked indefinitely until the medium-priority thread yields. This causes the controller to miss its 2ms deadline, and the actuators either hold their last command (causing drift) or receive a delayed command (causing a twitch). The solution is priority inheritance mutexes (available in PREEMPT_RT Linux) or lock-free data structures. Option B would show consistent timing-related drops, not intermittent twitches. Option C would show progressive degradation near singularities, not brief twitches. Option D would affect individual joint readings consistently during walking, not intermittently.',
    real_world_context:
      'The Mars Pathfinder mission experienced a famous priority inversion bug in 1997 that caused system resets. Modern humanoid robots (Boston Dynamics Atlas, Agility Digit) use priority inheritance protocols and lock-free architectures specifically to prevent this failure mode.',
    time_limit_seconds: 130,
    points: 5,
    tags: [
      'priority-inversion',
      'real-time',
      'humanoid',
      'fault-diagnosis',
      'mutex',
    ],
  },

  // SA-11  code_review  d4
  {
    question_text:
      'Review this swarm coordination protocol implementation. Identify the critical architectural flaw.',
    question_type: 'code_review',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    code_snippet: `class SwarmCoordinator:
    def __init__(self, robot_id: int, num_robots: int):
        self.id = robot_id
        self.num_robots = num_robots
        self.task_queue = []
        self.robot_positions = {}
        self.mqtt_client = MQTTClient(f"robot_{robot_id}")

    def assign_tasks(self, tasks: list[Task]):
        """Greedy nearest-task assignment"""
        available = list(tasks)
        assignments = {}

        for robot_id in range(self.num_robots):
            if not available:
                break
            pos = self.robot_positions.get(robot_id, (0, 0))
            nearest = min(available, key=lambda t: distance(pos, t.location))
            assignments[robot_id] = nearest
            available.remove(nearest)

        for rid, task in assignments.items():
            self.mqtt_client.publish(
                f"robot/{rid}/task", task.serialize()
            )

    def on_position_update(self, robot_id: int, position: tuple):
        self.robot_positions[robot_id] = position`,
    options: [
      {
        label: 'A',
        text: 'The greedy nearest-task algorithm is suboptimal and should use the Hungarian algorithm for optimal assignment',
      },
      {
        label: 'B',
        text: 'Every robot instance runs assign_tasks() independently using its own stale copy of robot_positions, causing conflicting task assignments where multiple robots are assigned the same task',
      },
      {
        label: 'C',
        text: 'The MQTT QoS level is not specified, defaulting to QoS 0 (fire-and-forget) which may lose task assignments',
      },
      {
        label: 'D',
        text: 'The task serialization format is not specified and may cause deserialization errors on the receiving robot',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'The critical flaw is that this code runs on EVERY robot in the swarm (each has a SwarmCoordinator instance), and each robot independently computes task assignments based on its own local copy of robot_positions. Due to network latency and message ordering differences, each robot\'s position map is slightly different, causing different robots to compute different "nearest" assignments. Robot A might assign Task 1 to itself (thinking it\'s closest) while Robot B also assigns Task 1 to itself (using its stale position data). This results in duplicate task execution or task conflicts. The fix requires either: (1) leader election so only one robot runs assign_tasks(), (2) a distributed consensus protocol for task claims, or (3) an auction-based system where robots bid and a resolution mechanism handles conflicts. Option A is a performance improvement, not a correctness bug. Option C is a valid concern but not the critical architectural flaw. Option D is an implementation detail.',
    real_world_context:
      'This exact bug pattern caused chaos in early Fetch Robotics warehouse deployments where multiple robots would simultaneously claim the same pickup task, leading to congestion and wasted cycles.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'swarm',
      'task-assignment',
      'consistency',
      'distributed-systems',
      'code-review',
    ],
  },

  // SA-12  scenario  d4
  {
    question_text:
      'You are designing the safety architecture for an autonomous construction robot (10-ton excavator). It must operate near human workers and stop within 500ms of detecting a human in the danger zone. What is the correct safety system architecture?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    scenario_context:
      'Robot: 10-ton autonomous excavator (Built Robotics style). Environment: Active construction site with human workers. Safety requirement: Stop all motion within 500ms of human detection in 5-meter danger zone. Regulatory: ISO 13482 (personal care robots) and ISO 10218 (industrial robots).',
    options: [
      {
        label: 'A',
        text: 'Dual-channel safety system: primary channel uses AI vision for human detection, secondary channel uses Safety-rated LiDAR (SIL-2) for zone monitoring. Both channels independently trigger the Safety-rated PLC which commands hydraulic lock valves. E-stop chain runs on hardwired safety relay, bypassing all software.',
      },
      {
        label: 'B',
        text: 'Single AI vision system with redundant cameras and a software watchdog that triggers software-controlled braking',
      },
      {
        label: 'C',
        text: 'Rely on human workers wearing RFID tags that trigger proximity alerts on the robot',
      },
      {
        label: 'D',
        text: 'Geofencing with GPS that prevents the robot from operating when humans are in the area',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'A dual-channel safety architecture is required by ISO 13849 (safety of machinery) for Performance Level d or higher, which is mandatory for a 10-ton machine near humans. The primary channel (AI vision) provides high-level understanding (human detection, pose estimation, intent prediction). The secondary channel (Safety-rated LiDAR, SIL-2 certified like SICK microScan3 or Pepperl+Fuchs R2000) provides guaranteed zone monitoring independent of the AI system. Both channels feed a Safety-rated PLC (e.g., Pilz PSS4000, Allen-Bradley GuardLogix) that commands fail-safe hydraulic lock valves. The hardwired E-stop chain ensures the machine can be stopped even if all software fails. Option B violates the dual-channel requirement (software-only safety is insufficient for SIL-2). Option C requires worker compliance and fails if tags are forgotten. Option D: GPS lacks the precision and reliability needed for 5-meter zone monitoring.',
    real_world_context:
      'Built Robotics, Caterpillar Command, and Komatsu\'s Intelligent Machine Control all use dual-channel safety architectures with Safety-rated LiDAR as the independent secondary channel for their autonomous excavators.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'safety',
      'dual-channel',
      'sil-2',
      'construction',
      'iso-13849',
      'excavator',
    ],
  },

  // SA-13  multiple_choice  d4
  {
    question_text:
      'In a microservices architecture for a robot fleet management system, which inter-service communication pattern is most appropriate for the path planning service that must respond within 50ms to avoid robot collisions?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Synchronous gRPC with Protocol Buffers for type-safe, low-latency request/response',
      },
      {
        label: 'B',
        text: 'Asynchronous message queue (RabbitMQ) with guaranteed delivery',
      },
      {
        label: 'C',
        text: 'REST API over HTTP/1.1 with JSON payloads',
      },
      {
        label: 'D',
        text: 'GraphQL subscriptions over WebSockets',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'For safety-critical path planning with a 50ms deadline, synchronous gRPC over HTTP/2 with Protocol Buffers is the correct choice. gRPC provides: (1) binary serialization (Protobuf) with ~10x less overhead than JSON, (2) HTTP/2 multiplexing eliminating head-of-line blocking, (3) typed contracts enforced at compile time, (4) native streaming support for continuous path updates, and (5) deadline propagation where the 50ms timeout is enforced by the framework. Measured latency for intra-datacenter gRPC: 0.5-2ms. Option B: Message queues add 5-50ms of broker overhead and provide eventual delivery, not guaranteed latency. Option C: HTTP/1.1 + JSON adds connection overhead and serialization latency (5-10ms). Option D: GraphQL adds query parsing overhead and is designed for flexible data fetching, not fixed-schema real-time control.',
    real_world_context:
      'Amazon Robotics fleet management uses gRPC for real-time path coordination between the central planner and individual Proteus/Hercules robots, where collision avoidance commands must arrive within 30ms.',
    time_limit_seconds: 80,
    points: 4,
    tags: ['grpc', 'microservices', 'fleet-management', 'latency', 'protobuf'],
  },

  // SA-14  multi_select  d5
  {
    question_text:
      'Which of the following are necessary architectural components for a robot self-replication system where a factory robot builds copies of itself? Select all that apply.',
    question_type: 'multi_select',
    difficulty: 5,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'A machine-readable Bill of Materials (BOM) with exact component specifications, sourcing information, and assembly sequence encoded in a domain-specific language',
      },
      {
        label: 'B',
        text: 'A verification oracle that can autonomously test whether a newly built robot meets functional specifications without human intervention',
      },
      {
        label: 'C',
        text: 'A quine-like firmware deployment system where the mother robot can replicate its own software stack, including the self-replication program itself, onto the child robot',
      },
      {
        label: 'D',
        text: 'A blockchain-based provenance system to track the lineage of each replicated robot',
      },
      {
        label: 'E',
        text: 'An error correction mechanism that detects and compensates for accumulated manufacturing tolerances across replication generations to prevent "genetic drift"',
      },
    ],
    correct_answers: ['A', 'B', 'C', 'E'],
    explanation:
      'A: Essential. The BOM serves as the "genome" of the robot, encoding what to build and how. Without a machine-readable assembly specification, the mother robot cannot autonomously plan fabrication sequences. B: Essential. A verification oracle (automated test suite: motor tests, sensor calibration checks, communication tests, basic behavior tests) ensures each child robot is functional before release. This is the "quality control" equivalent in biological reproduction. C: Essential. The self-replication property requires that the building instructions themselves are replicated, analogous to a quine in computer science. The mother must flash its own firmware (including the replication program) onto the child. D: Not necessary for replication itself; provenance tracking is useful for fleet management but is not a core replication requirement. E: Essential. Without error correction, manufacturing tolerances compound across generations (a robot built by a slightly imprecise robot builds an even less precise robot). This requires golden reference specifications that are copied digitally (not measured from the parent\'s physical dimensions).',
    real_world_context:
      'RepRap (self-replicating 3D printer) is the closest real-world implementation, demonstrating generational drift in printed components. MIT CSAIL\'s "self-replicating robots" research (Zykov et al., 2005) addressed the verification oracle and error correction problems.',
    time_limit_seconds: 130,
    points: 5,
    tags: [
      'self-replication',
      'quine',
      'bom',
      'verification',
      'generational-drift',
    ],
  },

  // SA-15  sequencing  d5
  {
    question_text:
      'Order the architectural layers of a complete autonomous robot software stack from lowest (closest to hardware) to highest (closest to mission objectives).',
    question_type: 'sequencing',
    difficulty: 5,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Hardware Abstraction Layer (HAL): device drivers, actuator interfaces, sensor bus protocols',
      },
      {
        label: 'B',
        text: 'Real-time control: PID loops, motor commutation, force/torque control at 1+ kHz',
      },
      {
        label: 'C',
        text: 'State estimation: sensor fusion (EKF/UKF), SLAM, localization at 100-200 Hz',
      },
      {
        label: 'D',
        text: 'Motion planning: trajectory optimization, collision avoidance, path planning at 10-50 Hz',
      },
      {
        label: 'E',
        text: 'Behavior/Task planning: finite state machines, behavior trees, task decomposition at 1-10 Hz',
      },
      {
        label: 'F',
        text: 'Mission management: multi-robot coordination, fleet scheduling, human-robot interaction at 0.1-1 Hz',
      },
    ],
    correct_answers: ['A', 'B', 'C', 'D', 'E', 'F'],
    explanation:
      'The canonical robot software stack follows a strict layered architecture where each layer operates at a decreasing frequency and increasing abstraction level. (1) HAL provides the raw interface to motors, sensors, and communication buses. (2) Real-time control runs the tightest loops (PID, current control) at 1+ kHz, directly commanding the HAL. (3) State estimation fuses sensor data into a coherent world model at 100-200 Hz, feeding into (4) Motion planning which computes collision-free trajectories at 10-50 Hz. (5) Behavior planning orchestrates sequences of motion primitives to accomplish tasks at 1-10 Hz. (6) Mission management sits at the top, coordinating across robots and interfacing with human operators. This layered architecture is formalized in the 3T architecture (Three-Layer: deliberative, sequencing, reactive) from Bonasso et al. (1997) and remains the standard in modern systems like ROS 2 Navigation2.',
    real_world_context:
      'This exact layered architecture is implemented in the NASA JPL Mars rover software stack (used in Curiosity and Perseverance), Boston Dynamics\' robot control hierarchy, and the ROS 2 Navigation2 framework.',
    time_limit_seconds: 120,
    points: 5,
    tags: [
      'software-stack',
      'layered-architecture',
      '3t-architecture',
      'sequencing',
      'full-stack',
    ],
  },

  // SA-16  fault_diagnosis  d4
  {
    question_text:
      'A fleet of 30 autonomous forklifts using a centralized task allocation server experiences cascading failures: when 3 forklifts go offline simultaneously for charging, the remaining 27 forklifts all stop responding to new tasks for 2-3 minutes before recovering. The task server CPU spikes to 100% during this period. What is the architectural root cause?',
    question_type: 'fault_diagnosis',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'The task reallocation algorithm has O(n!) complexity for reassigning orphaned tasks and the 3 simultaneous disconnections trigger a combinatorial explosion in the solver',
      },
      {
        label: 'B',
        text: 'The server uses synchronous health checks and the 3 offline forklifts cause TCP timeout blocking (30s each) that queues all subsequent task allocations behind the timeout wall',
      },
      {
        label: 'C',
        text: 'The forklifts are flooding the server with reconnection attempts using aggressive retry policies without backoff',
      },
      {
        label: 'D',
        text: 'The server\'s database runs a full table lock during task reallocation, blocking all concurrent reads',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Synchronous health checks with long TCP timeouts are a classic distributed systems anti-pattern. When the server performs synchronous health checks in the task allocation loop, each offline forklift causes a 30-second TCP timeout (default). With 3 offline forklifts checked sequentially: 3 * 30s = 90s of blocking. During this time, the single-threaded allocation loop cannot process any new task requests from the 27 active forklifts, causing the 2-3 minute stall. The 100% CPU is from the kernel TCP stack managing timeout retransmissions. The fix: use asynchronous health checks with short timeouts (500ms), circuit breaker pattern to immediately mark unresponsive robots as offline, and decouple health monitoring from the task allocation critical path. Option A would cause consistent slowness, not spiky behavior. Option C would show network saturation, not CPU spike. Option D would show database wait times in logs.',
    real_world_context:
      'This failure mode was documented in a 2019 RoboCup Logistics League post-mortem. Industrial fleet systems from KUKA, MiR, and Locus Robotics all implement circuit breaker patterns specifically to prevent health-check cascading failures.',
    time_limit_seconds: 100,
    points: 4,
    tags: [
      'cascading-failure',
      'tcp-timeout',
      'fleet-management',
      'circuit-breaker',
      'fault-diagnosis',
    ],
  },

  // SA-17  multiple_choice  d3
  {
    question_text:
      'What is the primary purpose of a behavior tree compared to a finite state machine in robot task planning?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Behavior trees provide modular, composable task structures with implicit failure handling through fallback nodes, avoiding the exponential state transition explosion of FSMs',
      },
      {
        label: 'B',
        text: 'Behavior trees execute faster than finite state machines because they use parallel processing',
      },
      {
        label: 'C',
        text: 'Behavior trees can handle continuous control while FSMs can only handle discrete states',
      },
      {
        label: 'D',
        text: 'Behavior trees are required by ROS 2 while FSMs are deprecated',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'Behavior trees (BTs) solve the "state explosion" problem of FSMs. In an FSM, adding a new behavior potentially requires transitions to/from every existing state, causing O(n^2) growth in transitions. BTs compose behaviors as tree nodes (sequence, fallback, parallel, condition, action) where adding new behavior is O(1) -- just add a new subtree. Fallback nodes provide automatic failure recovery: if an action fails, the tree tries the next child in the fallback node without explicit failure transitions. This modularity makes BTs much easier to maintain for complex robot behaviors. The ROS 2 Navigation2 stack uses BehaviorTree.CPP specifically for this reason. Option B is wrong; execution speed is similar. Option C is incorrect; both can wrap continuous controllers. Option D is false; SMACH (FSM library) is still used in ROS 2.',
    real_world_context:
      'The game industry pioneered behavior trees for NPC AI (Halo 2, 2004). Robotics adopted them through the BehaviorTree.CPP library, now standard in ROS 2 Nav2, used by Clearpath, OTTO Motors, and PAL Robotics.',
    time_limit_seconds: 70,
    points: 3,
    tags: [
      'behavior-tree',
      'fsm',
      'task-planning',
      'modularity',
      'nav2',
    ],
  },

  // SA-18  scenario  d4
  {
    question_text:
      'You are designing the software architecture for a robot that builds other robots on a production line. The builder robot must handle 47 different assembly operations (welding, screw driving, wire routing, pick-and-place, inspection, testing). Operations have complex dependencies (e.g., wire routing must happen after frame assembly but before cover installation). What is the correct task orchestration architecture?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    scenario_context:
      'Builder robot: 7-DOF arm with tool changer (welder, screwdriver, gripper, camera). Operations: 47 assembly steps with precedence constraints forming a DAG (Directed Acyclic Graph). Constraint: maximize parallelism where the robot has multiple end-effectors or can interleave non-conflicting operations. Product variants: 6 different robot models with different assembly sequences.',
    options: [
      {
        label: 'A',
        text: 'DAG-based task scheduler with topological sort for ordering, critical path analysis for prioritization, and a behavior tree executor for each operation node',
      },
      {
        label: 'B',
        text: 'Hardcoded sequential script for each of the 6 product variants',
      },
      {
        label: 'C',
        text: 'Single behavior tree encoding all 47 operations with conditional branches for each variant',
      },
      {
        label: 'D',
        text: 'Petri net with tokens representing component readiness states',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'A DAG-based task scheduler is the correct architecture for complex assembly with precedence constraints. The DAG encodes operations as nodes and dependencies as edges. Topological sorting produces a valid execution order respecting all precedence constraints. Critical path analysis identifies the longest dependency chain, allowing the scheduler to prioritize operations on the critical path to minimize total assembly time. Each operation node is executed by a behavior tree that handles the detailed motion sequence, error recovery, and quality checks for that specific operation (e.g., the "weld joint A" behavior tree handles approach, weld, inspect weld quality, retry if failed). Different product variants simply use different DAGs, loaded from a configuration database. Option B is unmaintainable at 47 * 6 = 282 codepaths. Option C becomes deeply nested and fragile. Option D is theoretically valid but less practical for execution and harder to integrate with robot control frameworks.',
    real_world_context:
      'Tesla\'s Gigafactory uses DAG-based assembly scheduling for its robot production lines. ABB\'s RobotStudio and Siemens Process Simulate both implement DAG task schedulers for multi-step robotic assembly planning.',
    time_limit_seconds: 120,
    points: 4,
    tags: [
      'dag',
      'task-scheduling',
      'assembly',
      'robot-building-robot',
      'behavior-tree',
    ],
  },

  // SA-19  code_review  d5
  {
    question_text:
      'Review this inter-robot communication protocol for a swarm of construction robots. Identify the critical safety vulnerability.',
    question_type: 'code_review',
    difficulty: 5,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    code_snippet: `import json
import socket

class SwarmProtocol:
    def __init__(self, robot_id: int, port: int = 9090):
        self.robot_id = robot_id
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind(('0.0.0.0', port))
        self.peers = {}  # {robot_id: (ip, port)}

    def broadcast_position(self, x: float, y: float, z: float):
        msg = json.dumps({
            'type': 'position',
            'robot_id': self.robot_id,
            'x': x, 'y': y, 'z': z,
            'timestamp': time.time()
        })
        for peer_addr in self.peers.values():
            self.sock.sendto(msg.encode(), peer_addr)

    def receive_command(self) -> dict:
        data, addr = self.sock.recvfrom(4096)
        msg = json.loads(data.decode())
        if msg['type'] == 'move_to':
            return {'action': 'move', 'target': (msg['x'], msg['y'], msg['z'])}
        elif msg['type'] == 'emergency_stop':
            return {'action': 'stop'}
        return {'action': 'noop'}

    def register_peer(self, robot_id: int, ip: str, port: int):
        self.peers[robot_id] = (ip, port)`,
    options: [
      {
        label: 'A',
        text: 'No authentication or message signing: any device on the network can inject spoofed move_to or emergency_stop commands, enabling a malicious actor to cause collisions between construction robots',
      },
      {
        label: 'B',
        text: 'JSON serialization is too slow for real-time swarm communication',
      },
      {
        label: 'C',
        text: 'UDP is unreliable and position updates may be lost, causing stale position data',
      },
      {
        label: 'D',
        text: 'The 4096-byte buffer may truncate large messages',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'The critical safety vulnerability is the complete absence of authentication, message integrity verification, or encryption. The protocol accepts and executes commands (move_to, emergency_stop) from any source IP without verifying the sender\'s identity. On a construction site network, any device (compromised laptop, rogue access point, misconfigured IoT sensor) can send a UDP packet to port 9090 with a spoofed move_to command, directing a multi-ton construction robot to an arbitrary position. Even worse, spoofed emergency_stop commands could disable safety-critical robots during load-bearing operations. The fix requires at minimum: HMAC message signing with pre-shared keys, sequence numbers to prevent replay attacks, and source IP validation against the registered peers list. For construction robots, IEC 62443 (industrial cybersecurity) mandates authentication for all safety-relevant communications. Options B, C, and D are valid concerns but are performance/reliability issues, not safety vulnerabilities that could cause physical harm.',
    real_world_context:
      'In 2017, researchers demonstrated that unsecured industrial robot protocols (similar to this code) could be exploited to alter robot trajectories. Trend Micro\'s research paper "Rogue Robots" showed attacks against ABB, KUKA, and Universal Robots communication protocols.',
    time_limit_seconds: 130,
    points: 5,
    tags: [
      'security',
      'authentication',
      'swarm',
      'construction',
      'code-review',
      'safety',
    ],
  },

  // SA-20  multi_select  d4
  {
    question_text:
      'Which architectural patterns are required for a robot system that must achieve 99.999% uptime (less than 5.26 minutes downtime per year) in a hospital medication delivery application? Select all that apply.',
    question_type: 'multi_select',
    difficulty: 4,
    domain_code: 'SYSTEM_ARCHITECTURE',
    level: 'master',
    options: [
      {
        label: 'A',
        text: 'Hot standby redundancy: a shadow robot tracks the primary robot\'s position and can take over its delivery within 30 seconds of primary failure',
      },
      {
        label: 'B',
        text: 'Watchdog timer architecture: hardware watchdog on the main compute module that triggers safe shutdown and fleet manager notification if the control loop hangs',
      },
      {
        label: 'C',
        text: 'Graceful degradation: the robot can complete its current delivery using dead reckoning if localization fails, then parks at a known safe location for recovery',
      },
      {
        label: 'D',
        text: 'Over-the-air update with A/B partition rollback so firmware updates never brick the robot',
      },
      {
        label: 'E',
        text: 'Single monolithic firmware image for faster boot time and simpler deployment',
      },
    ],
    correct_answers: ['A', 'B', 'C', 'D'],
    explanation:
      'Achieving 99.999% uptime (five nines) for a physical robot system requires defense in depth: A: Hot standby redundancy ensures service continuity even when a robot fails completely. The shadow robot (or any idle fleet robot) assumes the failed robot\'s pending deliveries. This is the primary mechanism for achieving five nines at the service level (not individual robot level). B: Hardware watchdog timers catch software hangs that would otherwise leave the robot unresponsive in a hallway. The watchdog triggers a safe state (stop, engage brakes) and notifies the fleet manager to dispatch the standby. C: Graceful degradation prevents a single sensor failure from causing a full stop. Dead reckoning for short distances (< 50m) allows the robot to reach a safe parking spot rather than blocking a hospital corridor. D: A/B partition OTA updates (as in Android\'s seamless updates) ensure that a failed firmware update automatically rolls back to the known-good partition on next boot, preventing bricked robots. E is incorrect: monolithic firmware images are the opposite of resilient; they lack rollback capability and a single bug takes down the entire system.',
    real_world_context:
      'Aethon TUG, Diligent Robotics Moxi, and Savioke Relay hospital delivery robots all implement these patterns. Aethon\'s TUG system specifically uses fleet-level hot standby to achieve the service-level availability required by hospital SLAs.',
    time_limit_seconds: 110,
    points: 4,
    tags: [
      'high-availability',
      'redundancy',
      'watchdog',
      'graceful-degradation',
      'ota-updates',
      'hospital',
    ],
  },
];
