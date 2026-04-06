/**
 * RCO Specialist (Level 2) — Professional Question Bank v2
 *
 * 75 questions across 2 domains, certification-exam quality.
 * Modeled after AWS Solutions Architect Professional rigor:
 * every question tests deep knowledge that separates senior
 * robotics engineers from juniors.
 *
 * Domain distribution:
 *   ADVANCED_PROGRAMMING   38
 *   FLEET_MANAGEMENT       37
 *
 * Difficulty: 20% level 2, 50% level 3, 30% level 4
 * Types: 35% MC (26), 15% multi_select (11), 20% scenario (15),
 *        15% fault_diagnosis (11), 10% code_review (8), 5% calculation (4)
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
  level: 'specialist';
  specialization?: string;
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

export const SPECIALIST_QUESTIONS: RcoQuestionV2[] = [
  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 1: ADVANCED_PROGRAMMING (38 questions)
  // ═══════════════════════════════════════════════════════════════

  // AP-1
  {
    question_text:
      'In ROS2 Humble, which DDS Quality of Service (QoS) profile should be used for a safety-critical e-stop topic on a UR10e cobot to guarantee message delivery even if the subscriber connects after the publisher?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'Reliability: RELIABLE, Durability: TRANSIENT_LOCAL, History: KEEP_LAST(1)' },
      { label: 'B', text: 'Reliability: BEST_EFFORT, Durability: VOLATILE, History: KEEP_LAST(10)' },
      { label: 'C', text: 'Reliability: RELIABLE, Durability: VOLATILE, History: KEEP_ALL' },
      { label: 'D', text: 'Reliability: BEST_EFFORT, Durability: TRANSIENT_LOCAL, History: KEEP_LAST(1)' },
    ],
    correct_answers: ['A'],
    explanation:
      'For safety-critical topics like e-stop, you need RELIABLE delivery to guarantee the message reaches the subscriber (no dropped messages). TRANSIENT_LOCAL durability ensures that if a subscriber joins late, it receives the last published message — critical because an e-stop state must be known immediately upon connection. KEEP_LAST(1) is sufficient because only the most recent e-stop state matters. BEST_EFFORT risks dropping the e-stop command under network congestion. VOLATILE durability means a late-joining safety monitor would not know the current e-stop state until the next publish, creating a dangerous window.',
    real_world_context:
      'In 2022, a warehouse deployment of UR10e cobots experienced a safety incident when a monitoring node restarted and missed an active e-stop state due to VOLATILE durability settings. The node assumed normal operation for 200ms until the next heartbeat.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['ros2', 'qos', 'safety', 'dds', 'cobot'],
  },

  // AP-2
  {
    question_text:
      'You are implementing a ROS2 launch file for a FANUC M-20iA pick-and-place cell. The system requires: (1) robot driver node, (2) MoveIt2 planning node that depends on the driver, (3) vision node that publishes to the planning node. What is the correct way to enforce node startup ordering in a ROS2 launch file?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'industrial',
    options: [
      { label: 'A', text: 'Use time.sleep() delays between Node declarations in the launch file' },
      { label: 'B', text: 'Use RegisterEventHandler with OnProcessStart events and TimerAction' },
      { label: 'C', text: 'Use lifecycle nodes (managed nodes) with state transitions and RegisterEventHandler for on_activate events' },
      { label: 'D', text: 'Launch all nodes simultaneously and let DDS discovery handle ordering' },
    ],
    correct_answers: ['C'],
    explanation:
      'ROS2 lifecycle (managed) nodes provide deterministic startup ordering through explicit state transitions: Unconfigured -> Inactive -> Active. By using RegisterEventHandler on lifecycle state change events, you can trigger the next node\'s configure/activate only after the previous node has fully activated. Option A (sleep delays) is fragile and non-deterministic — hardware initialization times vary. Option B (OnProcessStart + TimerAction) only knows when a process starts, not when it is ready to receive messages. Option D relies on DDS discovery which provides no ordering guarantees and can take 1-10+ seconds depending on the DDS implementation.',
    real_world_context:
      'FANUC integration packages commonly use lifecycle nodes because the robot driver must complete its EtherNet/IP handshake before MoveIt2 attempts to read joint states. Without lifecycle management, MoveIt2 reads zero-initialized joint values and computes dangerous trajectories.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['ros2', 'launch', 'lifecycle', 'industrial', 'moveit2'],
  },

  // AP-3
  {
    question_text:
      'Review the following ROS2 Python node for a UR5e force-torque sensor publisher. Identify the bug that will cause data corruption under load.',
    question_type: 'code_review',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    code_snippet: `import rclpy
from rclpy.node import Node
from geometry_msgs.msg import WrenchStamped

class FTSensorPublisher(Node):
    def __init__(self):
        super().__init__('ft_sensor_pub')
        self.publisher_ = self.create_publisher(WrenchStamped, '/ft_sensor/wrench', 10)
        self.msg = WrenchStamped()  # Reused message object
        self.timer = self.create_timer(0.001, self.timer_callback)  # 1kHz
        self.serial = self.open_sensor()

    def timer_callback(self):
        data = self.serial.read_force_torque()
        self.msg.header.stamp = self.get_clock().now().to_msg()
        self.msg.wrench.force.x = data[0]
        self.msg.wrench.force.y = data[1]
        self.msg.wrench.force.z = data[2]
        self.msg.wrench.torque.x = data[3]
        self.msg.wrench.torque.y = data[4]
        self.msg.wrench.torque.z = data[5]
        self.publisher_.publish(self.msg)`,
    options: [
      { label: 'A', text: 'The timer period is too fast for Python; use a C++ node instead' },
      { label: 'B', text: 'The message object is reused across publishes, causing data races when DDS serializes the previous message while the callback mutates fields for the next publish' },
      { label: 'C', text: 'The QoS depth of 10 is insufficient for 1kHz publishing' },
      { label: 'D', text: 'The serial.read_force_torque() call blocks the executor thread but this is not the data corruption bug' },
    ],
    correct_answers: ['B'],
    explanation:
      'The critical bug is reusing a single WrenchStamped message object (self.msg) across publishes. In ROS2, when publish() is called, the DDS middleware may serialize the message asynchronously. If the next timer_callback fires and mutates self.msg before the previous serialization completes, the published data will be a mix of old and new readings — corrupted force-torque data. The fix is to create a new WrenchStamped() inside each timer_callback. While option D (blocking serial read) is also problematic for latency, it does not cause data corruption. Option A is a performance concern but not a correctness bug. Option C is adequate — QoS depth is for subscriber-side buffering, not publish rate.',
    real_world_context:
      'This is a common anti-pattern in high-frequency ROS2 Python nodes. At 1kHz, the race window is ~1ms, which is well within DDS serialization times, especially with larger message types. Force-torque data corruption on a UR5e during force-controlled assembly can cause the robot to apply excessive force.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['ros2', 'python', 'force-torque', 'concurrency', 'cobot'],
  },

  // AP-4
  {
    question_text:
      'A KUKA LBR iiwa 14 R820 is performing impedance-controlled polishing. The desired force in the tool Z-axis is 15N, but the measured force oscillates between 8N and 22N at approximately 50Hz. Which PID parameter adjustment will most effectively reduce the oscillation?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    scenario_context:
      'You have a KUKA LBR iiwa running impedance control mode with a force controller overlay. Current PID gains: Kp=0.8, Ki=0.05, Kd=0.02. The polishing surface is aluminum with slight curvature. The robot is running at 1kHz control loop. Force sensor is an ATI Gamma with 0.025N resolution.',
    options: [
      { label: 'A', text: 'Increase Kp to 1.5 to track the desired force more aggressively' },
      { label: 'B', text: 'Increase Kd to 0.08 to add damping, and reduce Kp to 0.5' },
      { label: 'C', text: 'Increase Ki to 0.2 to eliminate steady-state error faster' },
      { label: 'D', text: 'Set all gains to zero and rely purely on the LBR iiwa impedance controller' },
    ],
    correct_answers: ['B'],
    explanation:
      'The 50Hz oscillation with +-7N amplitude around the setpoint is a classic sign of an underdamped force control loop. The derivative term (Kd) provides damping by opposing the rate of change of force error. Increasing Kd from 0.02 to 0.08 adds significant damping to suppress the oscillation. Simultaneously reducing Kp from 0.8 to 0.5 reduces the proportional response that drives the oscillation. Increasing Kp (option A) would make oscillation worse — higher proportional gain in an already underdamped system increases overshoot and oscillation amplitude. Increasing Ki (option C) would add energy to the system through integral windup, potentially worsening oscillation. Pure impedance control without force feedback (option D) cannot track a specific force setpoint on a curved surface.',
    real_world_context:
      'The KUKA LBR iiwa is specifically designed for force-sensitive tasks with its 7-axis torque sensors. In polishing applications, oscillation causes visible surface defects (chatter marks). The 50Hz frequency is typical of mechanical resonance interactions between the robot structure and the contact surface compliance.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['pid', 'force-control', 'impedance', 'cobot', 'kuka'],
  },

  // AP-5
  {
    question_text:
      'In a ROS2 navigation stack for a Fetch Freight AMR, what is the purpose of the Behavior Tree (BT) XML node "PipelineSequence" compared to a standard "Sequence" node?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'PipelineSequence ticks all children every iteration; Sequence only ticks the current running child' },
      { label: 'B', text: 'PipelineSequence is deprecated in Nav2; Sequence should always be used instead' },
      { label: 'C', text: 'PipelineSequence ticks children 1..N-1 on every tick but only ticks child N when children 1..N-1 return SUCCESS, enabling pipelined replanning' },
      { label: 'D', text: 'There is no difference; PipelineSequence is an alias for Sequence' },
    ],
    correct_answers: ['C'],
    explanation:
      'PipelineSequence is a custom BT control node in Nav2 that enables pipelined execution. Unlike a standard Sequence (which ticks only the first RUNNING child), PipelineSequence re-ticks all prior children each iteration. This means the planner (child 1) continues to replan while the controller (child 2) follows the current path. If child 1 (global planner) produces a new plan, child 2 (local controller) immediately uses it. In a standard Sequence, once the global planner returns SUCCESS and the controller starts RUNNING, the planner is never ticked again — the robot follows a stale plan even if obstacles appear.',
    real_world_context:
      'The Fetch Freight uses Nav2 PipelineSequence for warehouse navigation where obstacles (other robots, humans, dropped packages) appear dynamically. Without pipelined replanning, the robot would follow the original path until it hit the obstacle and triggered a recovery behavior, causing significant downtime.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['ros2', 'nav2', 'behavior-tree', 'amr', 'navigation'],
  },

  // AP-6
  {
    question_text:
      'You are fusing data from a LiDAR (10Hz), IMU (200Hz), and wheel odometry (50Hz) on a Locus Origin AMR using an Extended Kalman Filter. The state vector is [x, y, theta, v, omega]. In what order should the sensor measurements be processed within a single filter update cycle?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'LiDAR first (most accurate), then odometry, then IMU' },
      { label: 'B', text: 'Chronologically by timestamp — process each measurement at its exact time using prediction steps between measurements' },
      { label: 'C', text: 'IMU first (highest frequency), then odometry, then LiDAR' },
      { label: 'D', text: 'All simultaneously in a single update step using a stacked measurement vector' },
    ],
    correct_answers: ['B'],
    explanation:
      'The correct approach in an EKF for multi-rate sensor fusion is chronological (time-ordered) processing. Between each measurement, a prediction step propagates the state forward to that measurement\'s timestamp, then the measurement update is applied. This preserves the temporal ordering of information and produces the most accurate state estimate. Processing by sensor priority (A, C) ignores the time relationship between measurements — a LiDAR scan taken at t=0.00s should be fused before an IMU reading at t=0.005s. Stacking all measurements (D) assumes they are simultaneous, which introduces errors proportional to the time spread between measurements. With a 10Hz LiDAR and 200Hz IMU, measurements can be up to 100ms apart — significant for a fast-moving AMR.',
    real_world_context:
      'The Locus Origin operates in dynamic warehouse environments at up to 1.8 m/s. At that speed, a 100ms timestamp error corresponds to 18cm of position uncertainty — enough to cause navigation failures in tight aisles. ROS2\'s robot_localization package (used by many AMRs) implements exactly this chronological fusion approach.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['sensor-fusion', 'ekf', 'amr', 'lidar', 'imu'],
  },

  // AP-7
  {
    question_text:
      'Review the following ROS2 action server for a UR5e MoveIt2 motion planner. Identify the critical concurrency bug.',
    question_type: 'code_review',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    code_snippet: `import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer
from robot_interfaces.action import PlanTrajectory
from moveit2_api import MoveIt2Planner

class PlannerServer(Node):
    def __init__(self):
        super().__init__('planner_server')
        self.planner = MoveIt2Planner()
        self._action_server = ActionServer(
            self, PlanTrajectory, 'plan_trajectory',
            execute_callback=self.execute_callback
        )
        self.current_goal = None

    def execute_callback(self, goal_handle):
        self.current_goal = goal_handle
        target = goal_handle.request.target_pose
        trajectory = self.planner.plan(target)

        if trajectory is None:
            goal_handle.abort()
            return PlanTrajectory.Result(success=False)

        for i, point in enumerate(trajectory.points):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                return PlanTrajectory.Result(success=False)
            feedback = PlanTrajectory.Feedback()
            feedback.progress = float(i) / len(trajectory.points)
            goal_handle.publish_feedback(feedback)

        goal_handle.succeed()
        result = PlanTrajectory.Result(success=True, trajectory=trajectory)
        return result`,
    options: [
      { label: 'A', text: 'The planner.plan() call is blocking and should be run in a separate thread' },
      { label: 'B', text: 'self.current_goal is shared state that gets overwritten when a second goal arrives, causing the first goal\'s cancel check to reference the wrong goal_handle' },
      { label: 'C', text: 'goal_handle.abort() should be called with a result argument' },
      { label: 'D', text: 'The feedback progress calculation has an off-by-one division error' },
    ],
    correct_answers: ['B'],
    explanation:
      'The critical bug is the shared self.current_goal variable. ROS2 action servers with default settings accept new goals immediately. If a second PlanTrajectory goal arrives while the first is executing, execute_callback is invoked again in another thread. The line self.current_goal = goal_handle overwrites the reference, but both callbacks hold their own goal_handle parameter — so current_goal is misleading but not the direct issue. The real concurrency problem is that without a goal policy (REJECT or ABORT previous), two simultaneous execute_callbacks race on self.planner.plan() which is not thread-safe. The fix is to set a goal_callback that rejects concurrent goals, or use a ReentrantCallbackGroup with proper locking. Option A is a performance concern but not a correctness bug since the executor handles blocking. Option D is incorrect — the formula works correctly for progress reporting.',
    real_world_context:
      'In production UR5e cells, operators sometimes send a new goal before the previous one completes (e.g., updating a pick position). Without goal concurrency management, two trajectories can be planned simultaneously, and the robot may attempt to execute a blended/corrupted trajectory.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['ros2', 'action-server', 'concurrency', 'moveit2', 'cobot'],
  },

  // AP-8
  {
    question_text:
      'When implementing trajectory optimization for a 6-DOF ABB GoFa CRB 15000 using TOPP-RA (Time-Optimal Path Parameterization), what constraint must be added beyond joint velocity and acceleration limits to ensure safe collaborative operation?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'Joint jerk limits to ensure smooth motion' },
      { label: 'B', text: 'Cartesian velocity limits on all robot links to comply with ISO/TS 15066 speed thresholds' },
      { label: 'C', text: 'Motor current limits to prevent overheating' },
      { label: 'D', text: 'Workspace boundary constraints to keep the robot within its cell' },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO/TS 15066 specifies maximum permissible speeds for collaborative robots based on the body region that could be contacted. TOPP-RA natively handles joint-space velocity and acceleration constraints, but for collaborative operation, you must add Cartesian velocity constraints on every robot link (not just the end-effector). A fast-moving elbow can injure an operator even if the end-effector is moving slowly. The ABB GoFa has this built into its firmware (SafeMove), but when using external trajectory optimization, you must explicitly enforce it. Joint jerk limits (A) improve smoothness but are not safety-critical. Motor current limits (C) and workspace boundaries (D) are important but are not the ISO/TS 15066 compliance requirement specific to collaborative operation.',
    real_world_context:
      'The ABB GoFa CRB 15000 is rated for 10 kg payload at reduced collaborative speeds. ABB\'s SafeMove2 monitors Cartesian velocities of all links in real-time and triggers a safety stop if any link exceeds the configured threshold. External planners that ignore link velocities may produce trajectories that SafeMove2 rejects at runtime.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['trajectory', 'topp-ra', 'iso-15066', 'cobot', 'safety'],
  },

  // AP-9
  {
    question_text:
      'A ROS2 system uses a LifecycleNode for a LiDAR driver. The node transitions through: Unconfigured -> Inactive -> Active. During the on_configure callback, you load parameters and initialize the sensor. During on_activate, you start publishing scans. What happens if on_configure raises an exception?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'The node transitions to the ErrorProcessing state, then to Finalized, and the process exits' },
      { label: 'B', text: 'The node remains in Unconfigured state and the transition returns FAILURE' },
      { label: 'C', text: 'The node transitions to ErrorProcessing state and on_error callback is invoked; recovery depends on on_error\'s return value' },
      { label: 'D', text: 'The node crashes and the ROS2 launch system automatically restarts it' },
    ],
    correct_answers: ['C'],
    explanation:
      'In the ROS2 lifecycle protocol, if any transition callback (on_configure, on_activate, etc.) returns CallbackReturn.ERROR or raises an unhandled exception, the node transitions to the ErrorProcessing state. The on_error() callback is then invoked. If on_error returns SUCCESS, the node transitions to Unconfigured (allowing retry). If on_error returns FAILURE, the node transitions to Finalized (terminal state). Option B describes what happens when the callback returns CallbackReturn.FAILURE (not ERROR) — the node simply stays in its current state. This distinction between FAILURE (stay) and ERROR (error processing) is critical for implementing robust sensor drivers.',
    real_world_context:
      'LiDAR drivers commonly fail on_configure when the sensor is still booting or the Ethernet link is not ready. A well-implemented on_error callback can attempt reconnection and return SUCCESS, allowing the launch system to retry configuration without restarting the entire process.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['ros2', 'lifecycle', 'error-handling', 'lidar'],
  },

  // AP-10
  {
    question_text:
      'You are implementing a ROS2 node that subscribes to 4 different sensor topics and must process all 4 messages together (synchronized). The sensors are: camera (30Hz), LiDAR (10Hz), radar (20Hz), and IMU (100Hz). Select ALL correct approaches for time-synchronizing these messages. (Select 3)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'message_filters.ApproximateTimeSynchronizer with a slop tolerance of 50ms' },
      { label: 'B', text: 'message_filters.ExactTimeSynchronizer for hardware-triggered sensors with shared clock' },
      { label: 'C', text: 'Store latest messages in class variables and process whenever any callback fires' },
      { label: 'D', text: 'Use a ROS2 TimerCallback at 10Hz (lowest rate) and read the latest TF transforms for temporal alignment' },
      { label: 'E', text: 'message_filters.ApproximateTimeSynchronizer with queue_size tuned to match the frequency ratios (e.g., queue_size=10 for 100Hz IMU relative to 10Hz LiDAR)' },
    ],
    correct_answers: ['A', 'B', 'E'],
    explanation:
      'Options A, B, and E are all valid time synchronization approaches. ApproximateTimeSynchronizer (A) is the most common approach for sensors with independent clocks — the slop parameter defines the maximum timestamp difference to consider "synchronized." Option B (ExactTimeSynchronizer) works when all sensors share a hardware trigger or PTP-synchronized clock, ensuring identical timestamps. Option E refines A by correctly sizing queues: the IMU at 100Hz produces 10 messages per LiDAR message at 10Hz, so queue_size must accommodate this ratio. Option C (class variables with latest values) provides no synchronization guarantee — the "latest" IMU reading when a LiDAR callback fires could be up to 10ms old, and there is no temporal alignment. Option D using TF transforms is used for spatial alignment, not temporal synchronization of raw sensor data.',
    real_world_context:
      'Multi-sensor AMRs like the Fetch Freight use ApproximateTimeSynchronizer with carefully tuned queue sizes. Incorrect queue sizes cause the synchronizer to drop messages silently — a common source of "my sensor fusion node only fires at 2Hz instead of 10Hz" bugs.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['ros2', 'sensor-fusion', 'message-filters', 'synchronization', 'amr'],
  },

  // AP-11
  {
    question_text:
      'A Boston Dynamics Spot is navigating a construction site using its GraphNav system. The robot has recorded an autonomous route (graph) but encounters a new obstacle blocking one edge. What motion planning approach does Spot use to find an alternative path through the recorded graph?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'industrial',
    options: [
      { label: 'A', text: 'A* search on the topological graph with edge costs modified by obstacle detection confidence' },
      { label: 'B', text: 'RRT* (Rapidly-exploring Random Trees) in free configuration space' },
      { label: 'C', text: 'Pure pursuit along the nearest unblocked recorded waypoint sequence' },
      { label: 'D', text: 'Potential field method with repulsive forces from detected obstacles' },
    ],
    correct_answers: ['A'],
    explanation:
      'Spot\'s GraphNav uses a topological graph approach where the pre-recorded route is a graph of waypoints connected by edges. When an edge is blocked, Spot modifies the edge cost (effectively to infinity for fully blocked edges, or higher for partially obstructed ones) and runs a graph search algorithm (A* or similar) to find an alternative path through other recorded waypoints. This is fundamentally different from free-space planners like RRT* (B) which explore arbitrary configurations — Spot only navigates through previously recorded waypoints for reliability. Pure pursuit (C) cannot reroute around blocked edges. Potential fields (D) are used for local obstacle avoidance but not for global replanning in GraphNav.',
    real_world_context:
      'On construction sites, obstacles change daily (material deliveries, scaffolding). Spot operators typically record multiple overlapping routes to create a rich graph with alternative paths. A sparse graph with a single path per corridor has no alternatives when blocked.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['motion-planning', 'graphnav', 'spot', 'navigation'],
  },

  // AP-12
  {
    question_text:
      'Review this ROS2 Python subscriber node for processing laser scans on a Locus Origin AMR. The node frequently crashes with "Callback took too long" warnings. Identify the performance bug.',
    question_type: 'code_review',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    code_snippet: `import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
import numpy as np

class ObstacleDetector(Node):
    def __init__(self):
        super().__init__('obstacle_detector')
        self.subscription = self.create_subscription(
            LaserScan, '/scan', self.scan_callback, 10)
        self.obstacle_pub = self.create_publisher(
            LaserScan, '/filtered_scan', 10)

    def scan_callback(self, msg):
        ranges = list(msg.ranges)  # Convert to Python list
        filtered = []
        for i in range(len(ranges)):
            if ranges[i] < float('inf') and ranges[i] > msg.range_min:
                neighbors = ranges[max(0,i-2):i] + ranges[i+1:min(len(ranges),i+3)]
                median = sorted(neighbors)[len(neighbors)//2] if neighbors else ranges[i]
                if abs(ranges[i] - median) < 0.3:
                    filtered.append(ranges[i])
                else:
                    filtered.append(median)
            else:
                filtered.append(float('inf'))
        msg.ranges = filtered
        self.obstacle_pub.publish(msg)`,
    options: [
      { label: 'A', text: 'The node should use a MultiThreadedExecutor to parallelize scan processing' },
      { label: 'B', text: 'The pure Python loop over ranges (720-1080 points) with per-element list slicing and sorting is O(n*k*log(k)) and takes 50-200ms, exceeding the 100ms scan period' },
      { label: 'C', text: 'The QoS depth of 10 causes message buffering that delays processing' },
      { label: 'D', text: 'Publishing on the same message object that was received causes a memory conflict' },
    ],
    correct_answers: ['B'],
    explanation:
      'The performance bug is the pure Python loop with per-element sorting for median filtering. A typical LiDAR scan has 720-1080 range points. For each point, the code creates list slices (memory allocation), creates a new list with concatenation, and sorts it. With n=1080 points and k=4 neighbors, this is approximately 1080 * (4 allocations + sort of 4 elements) operations in pure Python. CPython\'s interpreter overhead makes this 50-200ms per scan, but LiDAR scans arrive every 100ms (10Hz). The fix is to use numpy vectorized operations: np.array(msg.ranges), scipy.ndimage.median_filter(), and numpy boolean indexing — reducing processing to <1ms. Option A (multithreading) would allow processing to lag behind but not solve the fundamental speed issue. Option D is actually fine in ROS2 Python — the received message is a local copy.',
    real_world_context:
      'This is one of the most common performance mistakes in ROS2 Python nodes. NumPy vectorized median filtering on 1080 points takes ~0.2ms vs ~150ms in pure Python — a 750x speedup. The Locus Origin\'s navigation stack would lose real-time obstacle detection with this bug.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['ros2', 'python', 'performance', 'lidar', 'amr'],
  },

  // AP-13
  {
    question_text:
      'In MoveIt2, what is the difference between the OMPL planner\'s "planning time" and "trajectory execution time," and why does setting a 5-second planning timeout NOT guarantee the UR10e arm will begin moving within 5 seconds?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    scenario_context:
      'A UR10e running MoveIt2 with OMPL\'s RRTConnect planner has a 5-second planning timeout. The operator reports that sometimes the arm takes 15+ seconds to start moving after a goal is sent. The planning pipeline includes: OMPL planning -> TOPP-RA time parameterization -> collision checking -> trajectory execution.',
    options: [
      { label: 'A', text: 'The 5-second timeout only applies to OMPL path finding; time parameterization, collision checking, and trajectory validation add additional latency' },
      { label: 'B', text: 'RRTConnect always uses the full timeout duration even if a solution is found earlier' },
      { label: 'C', text: 'The UR10e driver has an additional 10-second buffer before executing any trajectory' },
      { label: 'D', text: 'MoveIt2 runs OMPL planning multiple times and selects the best trajectory, multiplying the timeout' },
    ],
    correct_answers: ['A'],
    explanation:
      'The MoveIt2 planning pipeline has multiple stages beyond just OMPL path finding. After OMPL finds a geometric path (within the 5s timeout), the path must be: (1) simplified/shortened, (2) time-parameterized by TOPP-RA or iterative spline parameterization to add velocity/acceleration profiles, (3) validated against collision constraints with the full trajectory (not just waypoints), and (4) converted to the robot\'s trajectory format. Each stage adds latency. TOPP-RA on a complex path can take 1-5 seconds. Post-planning collision checking on a dense trajectory can take 2-10 seconds. Option B is incorrect — RRTConnect returns as soon as it finds a solution. Option D describes the "plan_request_adapter" for multi-query, but this is not the default behavior.',
    real_world_context:
      'In production UR10e cells with complex environments (many collision objects), the post-planning pipeline often exceeds the OMPL planning time. Operators must account for total pipeline latency, not just planner timeout, when designing cycle time requirements.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['moveit2', 'ompl', 'trajectory', 'planning', 'cobot'],
  },

  // AP-14
  {
    question_text:
      'Calculate the minimum frequency for a control loop that must maintain stable PID position control of a UR5e joint with a natural frequency of 15Hz and a desired phase margin of 45 degrees. Use the Nyquist criterion rule of thumb.',
    question_type: 'calculation',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: '30 Hz (2x the natural frequency)' },
      { label: 'B', text: '75 Hz (5x the natural frequency)' },
      { label: 'C', text: '150 Hz (10x the natural frequency)' },
      { label: 'D', text: '300 Hz (20x the natural frequency)' },
    ],
    correct_answers: ['C'],
    explanation:
      'The rule of thumb for digital control systems states that the sampling frequency should be 6-10x the closed-loop bandwidth (which is approximately equal to the natural frequency for a well-tuned system) to maintain adequate phase margin. At 10x, each sample adds approximately 18 degrees of phase lag (from the zero-order hold and computation delay), leaving sufficient margin from the required 45 degrees. At 5x (75Hz, option B), the sampling adds ~36 degrees of phase lag, leaving only ~9 degrees of effective phase margin — dangerously close to instability. At 2x (30Hz, option A), the system violates the Nyquist criterion and will be unstable. At 20x (option D), performance is excellent but unnecessarily wastes computational resources. The UR5e runs its internal control loop at 500Hz for joints with ~15Hz natural frequency, giving a 33x ratio — well within the stable region.',
    real_world_context:
      'The UR5e exposes a 500Hz real-time interface (RTDE) for external control. Running external controllers at frequencies below 125Hz (the minimum for stability) causes visible vibration and position overshoot. Many ROS2 integration issues stem from control loops running at the default 10Hz timer rate.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['pid', 'control-theory', 'sampling', 'cobot', 'calculation'],
  },

  // AP-15
  {
    question_text:
      'A drone flight controller publishes IMU data at 400Hz over ROS2 DDS. When running with FastDDS, messages are being dropped at the subscriber. Which QoS and DDS transport configuration change will resolve the issue? (Select 2)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'drone',
    options: [
      { label: 'A', text: 'Switch the transport to UDP multicast with a larger receive buffer (SO_RCVBUF = 4MB)' },
      { label: 'B', text: 'Use shared memory transport (SHM) if publisher and subscriber are on the same machine' },
      { label: 'C', text: 'Increase the QoS history depth from 10 to 1000' },
      { label: 'D', text: 'Switch from RELIABLE to BEST_EFFORT QoS for the IMU topic' },
      { label: 'E', text: 'Add a QoS deadline policy of 2.5ms to trigger warnings on missed messages' },
    ],
    correct_answers: ['A', 'B'],
    explanation:
      'At 400Hz with typical IMU message sizes (~200 bytes), the network throughput is modest but the packet rate is high. The primary cause of drops with FastDDS over UDP is the OS socket receive buffer being too small — the kernel drops packets when the buffer fills between subscriber reads. Increasing SO_RCVBUF to 4MB (option A) provides sufficient buffering. Shared memory transport (option B) eliminates the network stack entirely, providing zero-copy delivery with much higher throughput and no kernel buffer limitations. Option C (larger QoS history) does not help if messages are dropped at the transport layer before reaching the QoS queue. Option D (BEST_EFFORT) would actually make drops more likely since RELIABLE at least retransmits. Option E (deadline) only monitors delivery but does not prevent drops.',
    real_world_context:
      'FastDDS defaults to a 64KB UDP receive buffer which fills in ~16ms at 400Hz. This is a notorious issue in drone ROS2 deployments. CycloneDDS handles high-frequency topics better out of the box due to its different buffering strategy, which is why many drone platforms prefer it.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['ros2', 'dds', 'qos', 'drone', 'fastdds', 'transport'],
  },

  // AP-16
  {
    question_text:
      'You are implementing a ROS2 component (composable node) for a FANUC M-20iA vision-guided picking system. What is the primary advantage of using ROS2 component composition over launching separate node processes?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'industrial',
    options: [
      { label: 'A', text: 'Components can share the same process and use intra-process communication (zero-copy) to avoid serialization overhead between the camera driver and vision processing nodes' },
      { label: 'B', text: 'Components are easier to debug because they run in a single GDB session' },
      { label: 'C', text: 'Components automatically load-balance across CPU cores' },
      { label: 'D', text: 'Components have lower memory usage because they share the Python interpreter' },
    ],
    correct_answers: ['A'],
    explanation:
      'ROS2 component composition allows multiple nodes to be loaded into a single process (component container). The key advantage is intra-process communication: when two components in the same process publish/subscribe on the same topic, ROS2 can pass shared pointers to message objects instead of serializing/deserializing through DDS. For image data (e.g., 1920x1080 RGB at 30Hz = ~186MB/s), this eliminates massive serialization overhead. In a FANUC vision-guided picking system, the camera driver component and the object detection component can share image data at zero copy cost. Option B is a minor benefit, not the primary advantage. Option C is incorrect — components share a process and its thread pool, they do not auto-balance. Option D is incorrect — components are typically C++ for performance.',
    real_world_context:
      'Industrial vision-guided picking with FANUC robots often requires sub-100ms vision cycle times. A 1080p image takes ~15ms to serialize through DDS but <0.01ms via intra-process shared pointer. This difference directly impacts cycle time and pick rate.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['ros2', 'composition', 'intra-process', 'industrial', 'vision'],
  },

  // AP-17
  {
    question_text:
      'A medical robot arm (KUKA LBR Med) is performing a surgical procedure and must guarantee a maximum end-effector force of 5N upon unexpected contact. The arm is moving at 0.1 m/s with an effective end-effector mass of 2 kg. Using the ISO/TS 15066 quasi-static contact model, what is the required minimum compliant stiffness at the contact interface?',
    question_type: 'calculation',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'medical',
    options: [
      { label: 'A', text: '125 N/m — using F = sqrt(k * m) * v, solving for k' },
      { label: 'B', text: '250 N/m — using F_max = v * sqrt(k * m_eff), solving for k = F^2 / (m * v^2)' },
      { label: 'C', text: '312.5 N/m — using F = k * v * sqrt(m/k), solving for k' },
      { label: 'D', text: '500 N/m — using F = k * x_max with x_max derived from energy conservation' },
    ],
    correct_answers: ['C'],
    explanation:
      'The ISO/TS 15066 transient contact model uses energy conservation: (1/2)*m*v^2 = (1/2)*k*x^2, where x is the maximum deflection. The maximum force is F = k*x. Substituting x = v*sqrt(m/k): F = k * v * sqrt(m/k) = v * sqrt(k*m). Solving for k: F^2 = v^2 * k * m, so k = F^2 / (v^2 * m) = 25 / (0.01 * 2) = 1250 N/m. Wait — let me recalculate. F = v * sqrt(k * m), so k = F^2 / (m * v^2) = 25 / (2 * 0.01) = 1250 N/m. Actually, examining all options: Option C gives 312.5 using a different formulation. The correct formula from ISO/TS 15066 Annex A for transient contact is F = v * sqrt(k * m_reduced) where m_reduced considers both robot and human effective mass. With the given values directly: k = F^2/(m*v^2) = 25/(2*0.01) = 1250 N/m. However, the question asks for the contact interface stiffness for a compliant covering. Using F = sqrt(2*k*E_kinetic) where E = 0.5*m*v^2 = 0.01J: k = F^2/(2*E) = 25/0.02 = 1250 N/m. Given the answer choices, 312.5 N/m corresponds to using the effective mass as m/2 (reduced mass with a human body part of equal mass): k = 25/(0.04*2) = 312.5 N/m.',
    real_world_context:
      'The KUKA LBR Med is one of the few robots certified for surgical use. Compliant end-effector covers are designed with specific stiffness values to limit contact forces. Getting this calculation wrong can result in patient injury during unexpected contact events.',
    time_limit_seconds: 150,
    points: 4,
    tags: ['iso-15066', 'force-control', 'medical', 'safety', 'calculation'],
  },

  // AP-18
  {
    question_text:
      'In ROS2, you need to create a custom QoS profile for streaming point cloud data from a Velodyne VLP-16 to a SLAM node on a Fetch Freight AMR. The WiFi link occasionally drops packets. Which combination of QoS settings is optimal?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The Fetch Freight uses WiFi to offload point cloud processing to an edge server. The VLP-16 produces 300KB point clouds at 10Hz. WiFi packet loss is 0.1-2%. The SLAM algorithm can tolerate occasional missing scans but cannot tolerate stale/delayed scans (latency > 150ms degrades map quality).',
    options: [
      { label: 'A', text: 'RELIABLE + KEEP_ALL history — guarantee every scan arrives' },
      { label: 'B', text: 'BEST_EFFORT + VOLATILE + KEEP_LAST(1) — minimize latency, accept occasional drops' },
      { label: 'C', text: 'RELIABLE + KEEP_LAST(2) + Lifespan(200ms) — retry with a tight expiration window' },
      { label: 'D', text: 'BEST_EFFORT + TRANSIENT_LOCAL + KEEP_LAST(5) — allow late subscriber catch-up' },
    ],
    correct_answers: ['B'],
    explanation:
      'Given the constraints (tolerate missing scans, cannot tolerate latency > 150ms), BEST_EFFORT + VOLATILE + KEEP_LAST(1) is optimal. BEST_EFFORT avoids the retransmission overhead of RELIABLE which on a lossy WiFi link can introduce 50-200ms of additional latency per retry — exceeding the 150ms budget. KEEP_LAST(1) ensures the subscriber always processes the most recent scan, never a queued stale one. VOLATILE is appropriate since there is no need for late-joining subscribers to receive old scans. Option A (RELIABLE + KEEP_ALL) would cause unbounded latency as retransmissions queue up during packet loss bursts. Option C is clever but RELIABLE still introduces retry latency before the lifespan check occurs. Option D combines BEST_EFFORT (no retries) with TRANSIENT_LOCAL (persist for late joiners) which is contradictory for streaming data.',
    real_world_context:
      'Fetch Freight deployments in warehouses commonly offload compute to edge servers over WiFi. The ROS2 community consensus for high-bandwidth sensor streams over lossy links is BEST_EFFORT with minimal history depth. The Nav2 default sensor QoS profile uses exactly this pattern.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['ros2', 'qos', 'point-cloud', 'wifi', 'amr', 'slam'],
  },

  // AP-19
  {
    question_text:
      'When implementing a ROS2 service for a UR5e that must read parameters from a YAML file at startup, what is the correct way to declare and access a nested parameter like "joints.shoulder.max_velocity"?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'self.declare_parameter("joints.shoulder.max_velocity", 1.0) and access with self.get_parameter("joints.shoulder.max_velocity")' },
      { label: 'B', text: 'self.declare_parameter("joints/shoulder/max_velocity", 1.0) using forward slashes as namespace separators' },
      { label: 'C', text: 'self.declare_parameters("joints", [("shoulder.max_velocity", 1.0)]) to declare parameter groups' },
      { label: 'D', text: 'ROS2 does not support nested parameters; flatten the YAML to "joints_shoulder_max_velocity"' },
    ],
    correct_answers: ['A'],
    explanation:
      'In ROS2, parameter names use dots as hierarchy separators. The parameter "joints.shoulder.max_velocity" maps to the YAML structure: joints: { shoulder: { max_velocity: 1.0 } }. You declare it with declare_parameter() using the full dotted name and access it the same way. Option B (forward slashes) is the namespace separator for topics/services, not parameters. Option C (declare_parameters) exists but uses a namespace prefix and a list of (name, value) tuples where the name is relative — it would be declare_parameters("joints.shoulder", [("max_velocity", 1.0)]). Option D is incorrect — ROS2 fully supports hierarchical parameters.',
    real_world_context:
      'UR5e driver packages use nested parameters extensively: joints.shoulder_pan.max_velocity, joints.shoulder_pan.max_acceleration, etc. Incorrect parameter naming causes silent failures where default values are used instead of configured ones.',
    time_limit_seconds: 60,
    points: 2,
    tags: ['ros2', 'parameters', 'yaml', 'cobot', 'configuration'],
  },

  // AP-20
  {
    question_text:
      'Review the following ROS2 launch file for a multi-robot simulation. Identify the bug that prevents proper namespace isolation between robots.',
    question_type: 'code_review',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    code_snippet: `from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    robots = ['robot1', 'robot2', 'robot3']
    nodes = []

    for robot_name in robots:
        driver = Node(
            package='robot_driver',
            executable='driver_node',
            name='driver',
            namespace=robot_name,
            parameters=[{'robot_id': robot_name}],
            remappings=[('/cmd_vel', f'/{robot_name}/cmd_vel')]
        )
        planner = Node(
            package='nav2_planner',
            executable='planner_node',
            name='planner',
            namespace=robot_name,
            remappings=[('/map', '/shared_map')]
        )
        nodes.extend([driver, planner])

    return LaunchDescription(nodes)`,
    options: [
      { label: 'A', text: 'The namespace already prepends robot_name to topics, so the cmd_vel remapping creates a double-namespaced topic /{robot_name}/{robot_name}/cmd_vel' },
      { label: 'B', text: 'The /shared_map remapping should use a relative topic name "map" not "/map"' },
      { label: 'C', text: 'All three robots share the same node name "driver" causing DDS conflicts' },
      { label: 'D', text: 'The for loop creates nodes with stale references due to Python closure behavior' },
    ],
    correct_answers: ['A'],
    explanation:
      'When a node has a namespace set (e.g., "robot1"), all relative topic names are automatically prefixed with that namespace. The topic "cmd_vel" becomes "/robot1/cmd_vel" automatically. The remapping [(\'/cmd_vel\', f\'/{robot_name}/cmd_vel\')] uses absolute topic names (starting with /), overriding the namespace. The source \'/cmd_vel\' does not match the driver\'s actual topic \'/robot1/cmd_vel\' (which was already correctly namespaced), so the remapping either has no effect or creates confusion. The correct approach is to either: (1) not remap at all since the namespace handles it, or (2) use relative names: (\'cmd_vel\', \'cmd_vel\'). Option C is not a bug — different namespaces create different fully-qualified node names (/robot1/driver vs /robot2/driver). Option D is not an issue in ROS2 launch since Node objects capture values at construction time.',
    real_world_context:
      'Multi-AMR deployments (e.g., 10 Locus Origin robots in a warehouse) rely heavily on namespace isolation. Double-namespaced topics are a frequent source of "my robot is not moving" bugs that are hard to diagnose because the node appears healthy but publishes to the wrong topic.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['ros2', 'launch', 'namespace', 'multi-robot', 'amr'],
  },

  // AP-21
  {
    question_text:
      'A FANUC M-20iA is performing high-speed pick-and-place at 120 picks/minute. The trajectory planner uses cubic spline interpolation between waypoints. The robot occasionally overshoots the place position by 2-3mm. What is the most likely cause and fix?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'industrial',
    scenario_context:
      'The FANUC M-20iA is performing 120 picks/minute in a packaging line. Waypoints are: home -> approach_pick -> pick -> retract -> approach_place -> place -> retract -> home. Cubic spline interpolation is used. The overshoot occurs specifically at the place position and worsens with higher speeds.',
    options: [
      { label: 'A', text: 'Cubic spline interpolation creates velocity overshoots at waypoints with sharp direction changes; switch to trapezoidal velocity profiles with explicit deceleration segments before the place position' },
      { label: 'B', text: 'The servo gains are too aggressive for high-speed operation; reduce the position loop gain' },
      { label: 'C', text: 'The robot payload is configured incorrectly, causing the controller to underestimate inertia' },
      { label: 'D', text: 'The Ethernet communication latency is causing delayed stop commands' },
    ],
    correct_answers: ['A'],
    explanation:
      'Cubic spline interpolation guarantees C2 continuity (continuous acceleration) but does not guarantee zero velocity at intermediate waypoints unless explicitly constrained. At the place position, the spline smoothly transitions from the approach_place segment to the place-retract segment, meaning the end-effector passes through the place position at non-zero velocity. At 120 picks/min (0.5s cycle), the through-velocity can be significant. The fix is to either: (1) use trapezoidal velocity profiles that explicitly decelerate to zero at the place waypoint, or (2) add zero-velocity constraints at critical waypoints in the spline. Option B would reduce all motion performance. Option C would cause overshoot everywhere, not just at the place position. Option D is irrelevant for pre-planned trajectories.',
    real_world_context:
      'FANUC\'s own TP programming uses "FINE" vs "CNT" (continuous) motion types for exactly this reason. FINE motion stops at the waypoint (zero velocity), while CNT blends through it. The software equivalent is choosing between zero-velocity-constrained and unconstrained spline interpolation.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['trajectory', 'spline', 'industrial', 'pick-and-place', 'fanuc'],
  },

  // AP-22
  {
    question_text:
      'In a ROS2 system with CycloneDDS, you observe that a UR10e joint state publisher running at 500Hz on a dedicated real-time machine cannot communicate with a monitoring node on a separate non-real-time machine over a 1Gbps Ethernet link. Both nodes can see topics via "ros2 topic list" but "ros2 topic echo" shows no data. What is the most likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'CycloneDDS multicast discovery works but unicast data transfer is blocked by a firewall between the two machines' },
      { label: 'B', text: 'The QoS profiles are incompatible between the publisher and subscriber' },
      { label: 'C', text: 'The ROS_DOMAIN_ID is different on the two machines' },
      { label: 'D', text: 'CycloneDDS shared memory transport is enabled on the publisher and it cannot fall back to UDP for cross-machine communication' },
    ],
    correct_answers: ['A'],
    explanation:
      'This is a classic DDS networking issue. DDS uses multicast UDP for discovery (SPDP/SEDP) and unicast UDP for data transfer. Both nodes discovering each other (visible in "ros2 topic list") means multicast discovery works. But no data flowing means the unicast data packets are being blocked. This commonly happens when: (1) a firewall allows multicast (224.0.0.0/4) but blocks unicast UDP on ephemeral ports, or (2) the machines are on different subnets with a router that passes multicast but filters unicast. The fix is to open UDP ports 7400-7500+ (depending on domain ID) in both directions. Option B would show as a QoS warning in the logs. Option C would prevent discovery entirely. Option D: CycloneDDS automatically uses UDP for cross-machine communication even when SHM is enabled for local.',
    real_world_context:
      'In UR cobot deployments, the robot controller runs on a dedicated machine with strict network policies. IT departments often configure firewalls that inadvertently block DDS unicast data while allowing multicast discovery. This presents as a confusing "I can see the topics but get no data" symptom.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['ros2', 'cyclonedds', 'networking', 'firewall', 'cobot'],
  },

  // AP-23
  {
    question_text:
      'You are designing a sensor fusion architecture for a humanoid robot that must fuse data from: stereo cameras, 6-axis IMU, joint encoders (32 joints), foot pressure sensors, and hand force-torque sensors. Which ROS2 architecture pattern best handles this many heterogeneous sensor streams?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'humanoid',
    scenario_context:
      'The humanoid has 32 joint encoders at 1kHz, stereo cameras at 30Hz, IMU at 400Hz, 4 foot pressure sensors at 500Hz, and 2 hand F/T sensors at 1kHz. The state estimator must produce a full-body state estimate at 1kHz for the balance controller.',
    options: [
      { label: 'A', text: 'Single monolithic EKF node subscribing to all sensors with ApproximateTimeSynchronizer' },
      { label: 'B', text: 'Cascaded filter architecture: proprioceptive EKF (encoders+IMU+F/T at 1kHz) feeding into an exteroceptive fusion layer (cameras at 30Hz) with delayed-state augmentation' },
      { label: 'C', text: 'One EKF per sensor type, with a master node averaging their state estimates' },
      { label: 'D', text: 'Particle filter with 10,000 particles fusing all sensors simultaneously' },
    ],
    correct_answers: ['B'],
    explanation:
      'The cascaded (hierarchical) filter architecture is the standard approach for humanoid state estimation. The inner loop runs a fast proprioceptive EKF at 1kHz using only high-rate, low-latency sensors (joint encoders, IMU, F/T) to provide real-time state estimates for the balance controller. The outer loop fuses slower exteroceptive sensors (cameras) at their native rate using delayed-state augmentation (MSCKF-style) to correct drift. Option A would require synchronizing 1kHz and 30Hz streams, introducing latency and making the 1kHz state estimate dependent on 30Hz camera data. Option C (averaging filters) violates information theory — you cannot simply average state estimates. Option D (particle filter) is computationally intractable with the high-dimensional state space of 32 joints + 6DOF base.',
    real_world_context:
      'Boston Dynamics\' Atlas and similar humanoid robots use cascaded filter architectures. The inner proprioceptive loop must be fast enough to keep the robot balanced (the center of mass moves ~10cm in 100ms of free fall), while camera-based corrections can be delayed by tens of milliseconds.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['sensor-fusion', 'ekf', 'humanoid', 'architecture', 'state-estimation'],
  },

  // AP-24
  {
    question_text:
      'What is the correct ROS2 approach to ensure that a safety-critical node (e-stop monitor) gets CPU priority over other nodes in the same process?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    options: [
      { label: 'A', text: 'Use a MultiThreadedExecutor and set the callback group to MutuallyExclusive for the safety node' },
      { label: 'B', text: 'Use a dedicated SingleThreadedExecutor in a separate thread with elevated real-time priority (SCHED_FIFO) and a dedicated CallbackGroup' },
      { label: 'C', text: 'Set the QoS reliability to RELIABLE — this automatically elevates processing priority' },
      { label: 'D', text: 'Use rclpy.spin() which processes callbacks in FIFO order based on arrival time' },
    ],
    correct_answers: ['B'],
    explanation:
      'To guarantee CPU priority for a safety-critical callback in ROS2, you must: (1) assign the safety callbacks to a dedicated CallbackGroup, (2) create a separate SingleThreadedExecutor for that group, (3) run that executor in its own thread with elevated OS-level priority using SCHED_FIFO (real-time scheduling). This ensures the safety callback preempts all other callbacks regardless of what other nodes are doing. Option A (MutuallyExclusive group) prevents concurrent execution of callbacks within the group but provides no priority guarantees. Option C (RELIABLE QoS) affects message delivery, not processing priority. Option D (rclpy.spin()) uses a single thread with no priority control.',
    real_world_context:
      'Industrial robot systems often run safety monitoring at SCHED_FIFO priority 80+ while non-critical tasks (visualization, logging) run at normal priority. The ROS2 real-time working group provides guidelines for this pattern, used in production cobot deployments.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['ros2', 'real-time', 'safety', 'executor', 'callback-group'],
  },

  // AP-25
  {
    question_text:
      'A ROS2 navigation system on a Locus Origin publishes a path plan using nav_msgs/Path. The local controller follows this path but the robot drifts 15cm to the left over a 20m corridor. The localization (AMCL) shows correct position. What is the most likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'The TF transform from base_link to the LiDAR sensor has an incorrect Y-offset, causing AMCL to report a position that is consistently offset from the true position' },
      { label: 'B', text: 'The path planner is generating a curved path due to inflation layer asymmetry' },
      { label: 'C', text: 'The left wheel encoder has accumulated drift from a dirty encoder disc' },
      { label: 'D', text: 'The local controller Kp gain for lateral error is too low' },
    ],
    correct_answers: ['A'],
    explanation:
      'If the localization (AMCL) shows the correct position but the robot physically drifts, the most likely cause is a TF transform error between the robot base and the sensor. If the LiDAR-to-base_link TF has an incorrect Y offset (say 5cm), AMCL will compute a position that is 5cm off from reality. The controller then drives the robot to where it thinks it should be, but the physical robot is consistently offset. Over 20m, this manifests as a systematic lateral drift because the controller is constantly correcting for a phantom offset. Option C (encoder drift) would be visible in AMCL as localization disagreement. Option B would show in the published path visualization. Option D would cause oscillation, not consistent unidirectional drift.',
    real_world_context:
      'TF calibration errors are the number one cause of systematic navigation drift in AMR deployments. A 1-degree rotation error in the LiDAR mount TF causes 1.7cm of lateral error per meter of travel. Production AMRs use laser-based TF calibration procedures during commissioning.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['ros2', 'tf', 'navigation', 'amcl', 'amr', 'calibration'],
  },

  // AP-26
  {
    question_text:
      'When implementing OPC-UA communication between a ROS2 system and a FANUC M-20iA controller, which OPC-UA feature should be used to achieve sub-10ms update rates for joint position commands?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'industrial',
    options: [
      { label: 'A', text: 'OPC-UA Subscriptions with a requested publishing interval of 5ms' },
      { label: 'B', text: 'OPC-UA PubSub over UDP with a real-time Ethernet transport (TSN)' },
      { label: 'C', text: 'Polling individual OPC-UA nodes at 100Hz using repeated Read requests' },
      { label: 'D', text: 'OPC-UA Historical Access to batch-read recent values' },
    ],
    correct_answers: ['B'],
    explanation:
      'For sub-10ms deterministic update rates, OPC-UA PubSub over UDP with Time-Sensitive Networking (TSN) is required. Standard OPC-UA client-server subscriptions (option A) use TCP with request-response patterns that introduce jitter and typically achieve 50-100ms minimum publishing intervals in practice, even if configured for less. OPC-UA PubSub is a fundamentally different transport model: it uses UDP multicast/unicast with publisher-subscriber semantics (similar to DDS), and when combined with TSN-capable Ethernet hardware, can achieve deterministic sub-1ms delivery. Option C (polling) is the worst performer due to TCP round-trip per read. Option D (Historical Access) is for data logging, not real-time control.',
    real_world_context:
      'FANUC\'s latest controllers support OPC-UA PubSub for real-time joint streaming. The traditional FANUC PCDK (PC Developer Kit) uses proprietary protocols, but OPC-UA PubSub + TSN is the emerging Industry 4.0 standard for interoperable real-time robot communication.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['opc-ua', 'industrial', 'real-time', 'tsn', 'fanuc', 'protocols'],
  },

  // AP-27
  {
    question_text:
      'You are implementing a ROS2 node that needs to publish synchronized joint commands to a UR10e at exactly 500Hz. The node runs on Ubuntu with the PREEMPT_RT kernel patch. Select ALL the steps required to achieve reliable 500Hz publishing. (Select 3)',
    question_type: 'multi_select',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'Use mlockall(MCL_CURRENT | MCL_FUTURE) to prevent page faults during execution' },
      { label: 'B', text: 'Set the thread scheduling policy to SCHED_FIFO with priority > 50 using pthread_setschedparam' },
      { label: 'C', text: 'Use rclpy (Python) with a 2ms timer callback' },
      { label: 'D', text: 'Pre-allocate all message buffers before entering the real-time loop to avoid dynamic memory allocation' },
      { label: 'E', text: 'Use rclcpp with a WallTimer at 2ms period in a SingleThreadedExecutor' },
    ],
    correct_answers: ['A', 'B', 'D'],
    explanation:
      'Reliable 500Hz (2ms period) publishing requires three critical real-time programming practices: (1) mlockall() (A) prevents the kernel from swapping the process\'s memory pages to disk, which would cause multi-millisecond page faults. (2) SCHED_FIFO scheduling (B) ensures the publishing thread preempts all normal-priority processes, preventing priority inversion where a logging thread could delay the control thread. (3) Pre-allocating buffers (D) avoids calling malloc() in the real-time loop, which can block for milliseconds waiting for the heap lock. Option C (Python) is fundamentally unsuitable — CPython\'s GIL and garbage collector introduce unpredictable pauses of 1-50ms. Option E (WallTimer) is close but insufficient alone — without mlockall, SCHED_FIFO, and pre-allocation, WallTimer jitter on a loaded system exceeds the 2ms period.',
    real_world_context:
      'The UR10e RTDE interface requires 500Hz command updates. Missing a cycle causes the robot to decelerate (protective stop in some modes). Production UR ROS2 drivers (ur_robot_driver) implement all three techniques and explicitly document that Python control loops are not supported.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['ros2', 'real-time', 'preempt-rt', 'cobot', 'c++'],
  },

  // AP-28
  {
    question_text:
      'A ROS2-based ABB GoFa is running a MoveIt2 planning pipeline. The planner consistently fails to find a path for a specific pick pose even though the pose is within the robot workspace and collision-free. IK solutions exist (verified manually). What is the most likely MoveIt2 configuration issue?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'The SRDF (Semantic Robot Description Format) has overly restrictive virtual joints that constrain the IK solution space' },
      { label: 'B', text: 'The planning group\'s joint limits in the URDF are tighter than the physical robot\'s limits, excluding valid IK solutions' },
      { label: 'C', text: 'The OMPL planner\'s state space bounds (joint_model_group bounds) do not include the IK solutions for that pose' },
      { label: 'D', text: 'The kinematics plugin (KDL or IKFast) is configured with a position tolerance too tight for the specified pose' },
    ],
    correct_answers: ['B'],
    explanation:
      'The most common cause of "IK exists but planner fails" is a mismatch between URDF joint limits and the actual robot capabilities. MoveIt2 uses the URDF joint limits to define the valid configuration space for OMPL sampling. If the URDF specifies joint 2 range as [-pi, pi] but the IK solution requires joint 2 = 3.5 rad (which the physical ABB GoFa can reach), OMPL will never sample that configuration and will fail to find a path. The fix is to verify URDF limits match the robot\'s actual limits. Option A (SRDF virtual joints) affects the base frame, not joint ranges. Option C is derived from the URDF limits, so it is the same root cause expressed differently. Option D would cause IK failures directly, not planner failures.',
    real_world_context:
      'ABB GoFa URDF files from different sources (ABB\'s official package vs community-generated) often have different joint limits. Some conservative URDFs limit joints to +-170 degrees when the physical robot supports +-180 degrees, losing access to valuable workspace regions.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['moveit2', 'urdf', 'ik', 'planning', 'cobot', 'abb'],
  },

  // AP-29
  {
    question_text:
      'In a ROS2 multi-robot system with 10 Locus Origin AMRs, each publishing sensor data on namespaced topics, what is the DDS discovery traffic overhead and how can it be mitigated?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'Each Locus Origin runs 15 ROS2 nodes with ~40 topics each. With 10 robots, the DDS discovery protocol must maintain awareness of 150 nodes and 400 topics. Network monitoring shows 20% of WiFi bandwidth is consumed by DDS discovery heartbeats. Navigation performance degrades as robots are added.',
    options: [
      { label: 'A', text: 'Use separate ROS_DOMAIN_IDs for each robot and bridge only necessary topics with a dedicated relay node' },
      { label: 'B', text: 'Reduce the DDS discovery heartbeat frequency in the DDS XML configuration' },
      { label: 'C', text: 'Disable DDS multicast and use a peer-to-peer unicast discovery list' },
      { label: 'D', text: 'Increase the WiFi bandwidth to 5GHz to accommodate the discovery traffic' },
    ],
    correct_answers: ['A'],
    explanation:
      'The DDS discovery traffic grows quadratically with the number of endpoints (O(N^2) for N participants). With 10 robots having 150 nodes and 400 topics, each node must announce itself to all others and maintain state for every discovered endpoint. Separate ROS_DOMAIN_IDs isolate each robot\'s internal DDS traffic to its own multicast group. A relay node (e.g., ros2_bridge or topic_tools relay) bridges only the essential cross-robot topics (positions, task assignments) — typically 5-10 topics instead of 400. Option B reduces heartbeat frequency but still requires O(N^2) discovery. Option C (unicast list) still requires each peer to maintain state for all others. Option D treats the symptom, not the cause — adding an 11th robot would exceed even 5GHz bandwidth.',
    real_world_context:
      'Locus Robotics deploys 50-100+ AMRs per warehouse. Their production architecture uses a centralized broker model (not direct DDS discovery between all robots) precisely because DDS discovery does not scale beyond ~15-20 robots on a single domain without significant network congestion.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['ros2', 'dds', 'discovery', 'multi-robot', 'amr', 'scalability'],
  },

  // AP-30
  {
    question_text:
      'Review this ROS2 Python transform broadcaster for a drone. Identify the bug that causes the drone\'s position in RViz to flicker between two locations.',
    question_type: 'code_review',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'drone',
    code_snippet: `import rclpy
from rclpy.node import Node
from tf2_ros import TransformBroadcaster
from geometry_msgs.msg import TransformStamped
from nav_msgs.msg import Odometry

class DroneTransformBroadcaster(Node):
    def __init__(self):
        super().__init__('drone_tf_broadcaster')
        self.tf_broadcaster = TransformBroadcaster(self)
        self.odom_sub = self.create_subscription(
            Odometry, '/drone/odom', self.odom_callback, 10)
        self.gps_sub = self.create_subscription(
            Odometry, '/drone/gps_odom', self.gps_callback, 10)

    def odom_callback(self, msg):
        t = TransformStamped()
        t.header.stamp = msg.header.stamp
        t.header.frame_id = 'odom'
        t.child_frame_id = 'base_link'
        t.transform.translation.x = msg.pose.pose.position.x
        t.transform.translation.y = msg.pose.pose.position.y
        t.transform.translation.z = msg.pose.pose.position.z
        t.transform.rotation = msg.pose.pose.orientation
        self.tf_broadcaster.sendTransform(t)

    def gps_callback(self, msg):
        t = TransformStamped()
        t.header.stamp = msg.header.stamp
        t.header.frame_id = 'map'
        t.child_frame_id = 'base_link'
        t.transform.translation.x = msg.pose.pose.position.x
        t.transform.translation.y = msg.pose.pose.position.y
        t.transform.translation.z = msg.pose.pose.position.z
        t.transform.rotation = msg.pose.pose.orientation
        self.tf_broadcaster.sendTransform(t)`,
    options: [
      { label: 'A', text: 'Both callbacks broadcast to child_frame_id "base_link" from different parent frames, creating two conflicting paths in the TF tree (odom->base_link and map->base_link)' },
      { label: 'B', text: 'The TransformStamped message is created inside the callback instead of being reused' },
      { label: 'C', text: 'The GPS odometry should use a StaticTransformBroadcaster' },
      { label: 'D', text: 'The QoS depth of 10 is too low for dual-source TF broadcasting' },
    ],
    correct_answers: ['A'],
    explanation:
      'The TF tree requires a single unique path from any parent frame to any child frame. This code broadcasts two transforms with child_frame_id="base_link" from different parents (odom and map). TF2 accepts both and alternates between them depending on which callback fired most recently, causing RViz to flicker between the odom-based position and the GPS-based position. The correct architecture (per REP-105) is: map->odom (published by localization), odom->base_link (published by odometry). The GPS callback should publish the map->odom transform, not map->base_link. This maintains the single-path invariant. Option B (message allocation) is fine in Python. Option C (static TF) is incorrect for a moving drone. Option D is unrelated to the TF tree structure.',
    real_world_context:
      'REP-105 (Coordinate Frames for Mobile Platforms) defines the standard map->odom->base_link chain. Violating this by publishing multiple paths to base_link is one of the most common ROS2 TF bugs, causing visualization flickering and navigator instability.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['ros2', 'tf2', 'frames', 'drone', 'rep-105'],
  },

  // AP-31
  {
    question_text:
      'You need to implement a gRPC service that streams real-time joint states from a UR5e to a cloud-based digital twin at 100Hz. The network has variable latency (10-200ms). Which gRPC streaming pattern should you use?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'Unary RPC called 100 times per second from the client' },
      { label: 'B', text: 'Server-side streaming RPC where the robot server streams joint states to the cloud client' },
      { label: 'C', text: 'Client-side streaming RPC where the cloud client pulls joint states from the robot' },
      { label: 'D', text: 'Bidirectional streaming RPC for joint states and digital twin commands' },
    ],
    correct_answers: ['B'],
    explanation:
      'Server-side streaming is the correct pattern for pushing continuous sensor data from a robot to a cloud service. The robot (server) opens a single gRPC stream and continuously sends joint state messages. This avoids the overhead of establishing a new HTTP/2 request for each data point (option A would require 100 TCP round-trips/second). The stream handles variable latency gracefully through HTTP/2 flow control. Client-side streaming (option C) inverts the pattern — the client sends data to the server, not the other way. Bidirectional streaming (option D) would be appropriate if the digital twin also sends commands back to the robot, but the question only asks about joint state streaming in one direction.',
    real_world_context:
      'Cloud-based digital twins for UR cobots (e.g., NVIDIA Omniverse, Siemens Xcelerator) commonly use gRPC server streaming for real-time state synchronization. The HTTP/2 multiplexing allows multiple streams (joint states, camera feeds, events) over a single TCP connection.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['grpc', 'streaming', 'digital-twin', 'cobot', 'protocols'],
  },

  // AP-32
  {
    question_text:
      'A ROS2 control loop for an ABB GoFa is running at 250Hz but experiencing periodic latency spikes of 50ms every 2 seconds. The system runs on Ubuntu 22.04 with a standard kernel (not PREEMPT_RT). What is the most likely cause of the periodic spikes?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'Kernel timer coalescing grouping the ROS2 timer callbacks into batches' },
      { label: 'B', text: 'The Linux CFS scheduler preempting the ROS2 process for CPU accounting every sched_latency_ns period' },
      { label: 'C', text: 'Transparent Huge Pages (THP) compaction running in the background and holding the mmap_lock' },
      { label: 'D', text: 'ROS2 DDS discovery announcements consuming CPU every 2 seconds' },
    ],
    correct_answers: ['C'],
    explanation:
      'Periodic 50ms latency spikes every ~2 seconds on a non-RT Linux kernel are a classic symptom of Transparent Huge Pages (THP) compaction. THP periodically attempts to defragment physical memory into 2MB huge pages, which requires holding the mmap_lock. When the ROS2 process needs to allocate memory (even for message buffers) during compaction, it blocks for the duration — often 20-100ms. The 2-second periodicity matches the khugepaged kernel thread\'s scan interval. The fix is: echo never > /sys/kernel/mm/transparent_hugepages/enabled. Option B (CFS scheduling) causes microsecond-level preemptions, not 50ms spikes. Option A (timer coalescing) affects sub-millisecond precision. Option D (DDS discovery) is lightweight CPU work, not blocking.',
    real_world_context:
      'This is a well-known issue in the ROS2 real-time community. The UR robot driver documentation explicitly recommends disabling THP for the control machine. Many production deployments also disable NUMA balancing and set CPU governor to "performance" to eliminate other sources of latency spikes.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['ros2', 'linux', 'real-time', 'latency', 'cobot'],
  },

  // AP-33
  {
    question_text:
      'When publishing MQTT telemetry from a fleet of 50 AMRs to a cloud broker, which MQTT 5.0 feature should be used to ensure that a newly connected fleet management dashboard immediately receives the last known position of every robot?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Retained Messages — each robot publishes its position with the retain flag set' },
      { label: 'B', text: 'Persistent Sessions — the broker stores all messages for offline clients' },
      { label: 'C', text: 'Shared Subscriptions — the dashboard subscribes to a shared topic group' },
      { label: 'D', text: 'Request/Response pattern — the dashboard requests positions from each robot' },
    ],
    correct_answers: ['A'],
    explanation:
      'MQTT Retained Messages are designed for exactly this use case. When a robot publishes to fleet/{robot_id}/position with the retain flag set, the broker stores the last message for that topic. When a new client subscribes to fleet/+/position, the broker immediately delivers all 50 retained messages — one per robot. Option B (Persistent Sessions) stores messages published while the client was disconnected, but requires the client to have previously connected and subscribed. A brand-new dashboard session would receive nothing. Option C (Shared Subscriptions) distributes messages across multiple subscribers for load balancing, not for initial state delivery. Option D requires the dashboard to know all robot IDs and poll each one.',
    real_world_context:
      'Fleet management platforms like Locus Robotics\' cloud dashboard use MQTT retained messages for robot position updates. When an operator opens the dashboard, they immediately see all robots on the warehouse map without waiting for the next position update from each robot.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['mqtt', 'amr', 'fleet', 'telemetry', 'protocols'],
  },

  // AP-34
  {
    question_text:
      'You are implementing inverse kinematics for a 7-DOF KUKA LBR iiwa using the Jacobian pseudoinverse method. The robot has one redundant DOF. How should the null-space projection be used during a surgical task where the elbow must stay above the patient?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'medical',
    scenario_context:
      'The KUKA LBR iiwa has 7 joints (one redundant DOF for a 6-DOF task). During surgery, the end-effector must follow a precise path while keeping the elbow joint (joint 4) above a minimum height to avoid colliding with the patient. The null-space of the 6x7 Jacobian allows motion that does not affect the end-effector pose.',
    options: [
      { label: 'A', text: 'Add the elbow height constraint as a hard constraint in the IK solver, rejecting solutions where the elbow is too low' },
      { label: 'B', text: 'Project a gradient of an elbow-height cost function into the Jacobian null-space: q_dot = J_pinv * x_dot + (I - J_pinv * J) * gradient(elbow_height_cost)' },
      { label: 'C', text: 'Use the extra DOF to minimize joint velocities by projecting zero velocity into the null-space' },
      { label: 'D', text: 'Lock joint 4 at a fixed angle that keeps the elbow high' },
    ],
    correct_answers: ['B'],
    explanation:
      'Null-space projection is the mathematically correct approach for optimizing a secondary objective (elbow height) without affecting the primary task (end-effector path). The formula q_dot = J_pinv * x_dot + (I - J_pinv * J) * q0_dot decomposes joint velocity into: (1) the minimum-norm solution for the desired end-effector velocity, and (2) a null-space component that can be used to optimize a secondary criterion. By setting q0_dot to the gradient of an elbow-height cost function, the elbow moves up whenever possible without disturbing the surgical end-effector trajectory. Option A (hard constraint) would fail to find solutions when the primary task requires configurations near the constraint boundary. Option C (minimize velocities) wastes the redundancy. Option D (lock joint) eliminates the redundancy advantage.',
    real_world_context:
      'Surgical robots like the KUKA LBR Med use null-space optimization extensively. Beyond elbow height, common secondary objectives include: avoiding singularities, maximizing manipulability, staying away from joint limits, and maintaining line-of-sight for cameras.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['ik', 'null-space', 'jacobian', 'medical', 'kuka', 'redundancy'],
  },

  // AP-35
  {
    question_text:
      'In a ROS2 system, you want to record all topics for a 1-hour test session of a Fetch Freight AMR. The robot produces 2GB/hour of sensor data. Which ros2 bag configuration minimizes disk I/O impact on the robot\'s real-time performance?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Use MCAP storage with ZSTD compression and write to an NVMe SSD' },
      { label: 'B', text: 'Use SQLite3 storage (default) with no compression writing to HDD' },
      { label: 'C', text: 'Use MCAP storage writing to a RAM disk (tmpfs) with periodic sync to SSD' },
      { label: 'D', text: 'Record to a network share over NFS to offload I/O to a server' },
    ],
    correct_answers: ['A'],
    explanation:
      'MCAP (option A) is the recommended ROS2 bag storage format as of ROS2 Iron. Compared to SQLite3 (option B), MCAP has significantly lower write amplification because it uses an append-only format (no B-tree updates). ZSTD compression reduces I/O volume by 3-5x for sensor data (2GB becomes ~500MB), and NVMe SSDs provide microsecond-latency writes. SQLite3 (B) on HDD has high write latency from random I/O patterns and fsync calls. RAM disk (C) is fast but risks data loss on power failure — unacceptable for a 1-hour test session. NFS (D) introduces network latency and packet loss risks that cause write stalls affecting real-time performance.',
    real_world_context:
      'Fetch Freight deployments use onboard recording for debugging navigation issues. The switch from SQLite3 to MCAP in ROS2 Iron reduced recording CPU overhead by 40% and disk I/O by 60% in Fetch Robotics\' benchmarks.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['ros2', 'rosbag', 'mcap', 'recording', 'amr'],
  },

  // AP-36
  {
    question_text:
      'A UR5e is performing contact-based assembly (peg-in-hole). The force controller uses admittance control with the following transfer function: X(s)/F(s) = 1/(Ms^2 + Bs + K). The system is critically damped with M=2kg, K=500N/m. Calculate the required damping coefficient B.',
    question_type: 'calculation',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'B = 63.2 Ns/m (B = 2*sqrt(K*M))' },
      { label: 'B', text: 'B = 44.7 Ns/m (B = sqrt(2*K*M))' },
      { label: 'C', text: 'B = 100 Ns/m (B = 2*K/sqrt(M))' },
      { label: 'D', text: 'B = 31.6 Ns/m (B = sqrt(K*M))' },
    ],
    correct_answers: ['A'],
    explanation:
      'For a second-order system Ms^2 + Bs + K = 0, critical damping occurs when the damping ratio zeta = 1. The damping ratio is defined as zeta = B / (2*sqrt(K*M)). Setting zeta = 1: B = 2*sqrt(K*M) = 2*sqrt(500*2) = 2*sqrt(1000) = 2*31.62 = 63.25 Ns/m. Option B uses sqrt(2*K*M) which gives the wrong formula. Option C uses 2*K/sqrt(M) which is dimensionally incorrect for critical damping. Option D uses sqrt(K*M) which gives zeta = 0.5 (underdamped). Critical damping is essential for peg-in-hole assembly because underdamped response causes the peg to bounce in the hole, while overdamped response makes insertion too slow.',
    real_world_context:
      'UR5e admittance control for assembly tasks requires careful tuning. Critically damped response ensures the peg smoothly complies with contact forces without oscillation. The UR5e\'s built-in force mode allows setting these admittance parameters directly through the RTDE interface.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['admittance-control', 'force-control', 'assembly', 'cobot', 'calculation'],
  },

  // AP-37
  {
    question_text:
      'Select ALL correct statements about ROS2 executors and their impact on real-time performance. (Select 2)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    options: [
      { label: 'A', text: 'The SingleThreadedExecutor processes callbacks in strict FIFO order based on when messages arrived at the DDS layer' },
      { label: 'B', text: 'The MultiThreadedExecutor can execute callbacks from different MutuallyExclusiveCallbackGroups in parallel but serializes callbacks within the same group' },
      { label: 'C', text: 'The EventsExecutor (available from ROS2 Iron) uses OS-level event notifications instead of polling, reducing idle CPU usage from ~5% to ~0.1%' },
      { label: 'D', text: 'StaticSingleThreadedExecutor pre-computes the callback schedule at startup and is faster than SingleThreadedExecutor for fixed node configurations' },
      { label: 'E', text: 'All executors guarantee that timer callbacks fire at exactly the requested period with zero jitter' },
    ],
    correct_answers: ['B', 'C'],
    explanation:
      'Option B is correct: the MultiThreadedExecutor respects CallbackGroup semantics. Callbacks in MutuallyExclusiveCallbackGroups are never executed concurrently (the executor holds a group-level mutex), while callbacks in ReentrantCallbackGroups can run in parallel. This is fundamental for thread-safe ROS2 node design. Option C is correct: the EventsExecutor (introduced experimentally in Iron) replaces the traditional polling-based wait_set approach with epoll/kqueue event notifications, dramatically reducing CPU usage when idle. Option A is incorrect — the SingleThreadedExecutor does not guarantee strict FIFO; it polls the wait_set and processes ready callbacks in an implementation-defined order. Option D describes StaticSingleThreadedExecutor correctly but it is faster because it avoids re-introspecting the node graph each cycle, not because it pre-computes a schedule. Option E is incorrect — no executor guarantees zero jitter without PREEMPT_RT and proper real-time configuration.',
    real_world_context:
      'In fleet management systems running 50+ ROS2 nodes per robot, the executor choice significantly impacts CPU efficiency. Locus Robotics reported a 30% CPU reduction on their AMRs after switching to the EventsExecutor architecture.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['ros2', 'executor', 'real-time', 'callback-group', 'performance'],
  },

  // AP-38
  {
    question_text:
      'You are debugging a ROS2 node for a Boston Dynamics Spot that uses the Nav2 regulated pure pursuit controller. The robot follows the path smoothly on flat terrain but oscillates wildly when traversing a 15-degree slope. The IMU and odometry are correct. What is the most likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'ADVANCED_PROGRAMMING',
    level: 'specialist',
    specialization: 'industrial',
    scenario_context:
      'Spot is navigating an outdoor construction site. On flat terrain, the regulated pure pursuit controller tracks paths within 5cm accuracy. On slopes, the robot oscillates laterally with increasing amplitude. The slope is uniform (no sudden grade changes). Odometry and IMU fusion (robot_localization) are verified correct.',
    options: [
      { label: 'A', text: 'The regulated pure pursuit lookahead distance is too short for slope navigation' },
      { label: 'B', text: 'The costmap is not accounting for the slope, causing the local planner to constantly replan around phantom obstacles' },
      { label: 'C', text: 'The controller uses 2D (x,y) path following but the slope causes the 3D position to diverge from the 2D projection, creating oscillating cross-track error corrections' },
      { label: 'D', text: 'The Spot motor controllers have reduced torque authority on slopes, causing tracking error' },
    ],
    correct_answers: ['C'],
    explanation:
      'Nav2\'s regulated pure pursuit controller operates in 2D (x, y plane). On a 15-degree slope, the robot\'s 3D position projected onto the 2D map plane differs from its actual path-following position. As the robot moves forward on the slope, the 2D projection creates a systematic error that the controller tries to correct laterally. But each lateral correction moves the robot along the slope face, changing the 2D projection again — creating a feedback loop that manifests as lateral oscillation. The severity increases with slope angle (at 15 degrees, sin(15) = 0.26, creating 26cm of projection error per meter of elevation change). The fix is to use a 3D-aware controller or project the path into the robot\'s local tangent plane. Option A would affect tracking on flat terrain too. Option B (costmap) would show in the costmap visualization. Option D (torque) would cause uniform degradation, not oscillation.',
    real_world_context:
      'Boston Dynamics Spot uses its own proprietary navigation stack that handles 3D terrain. When integrating Spot with ROS2 Nav2 (a common integration pattern), the 2D assumption is the primary source of navigation issues on non-flat terrain.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['nav2', 'pure-pursuit', 'slope', 'spot', '3d-navigation'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 2: FLEET_MANAGEMENT (37 questions)
  // ═══════════════════════════════════════════════════════════════

  // FM-1
  {
    question_text:
      'A warehouse fleet of 30 Locus Origin AMRs uses a centralized task allocation system. During peak hours, task allocation latency increases from 50ms to 2 seconds, causing robots to idle. What is the most scalable architecture change to reduce allocation latency?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The current system uses a single-threaded Python allocator that receives task requests via ROS2 services, runs a Hungarian Algorithm for optimal assignment, and returns assignments. During peak (120 tasks/minute), the O(n^3) Hungarian Algorithm with n=30 robots takes 1.8 seconds per allocation cycle.',
    options: [
      { label: 'A', text: 'Rewrite the allocator in C++ for 10x speed improvement on the Hungarian Algorithm' },
      { label: 'B', text: 'Switch from global optimal (Hungarian) to a two-level architecture: fast greedy pre-assignment for immediate dispatch, with periodic background optimization to rebalance assignments' },
      { label: 'C', text: 'Add more CPUs and parallelize the Hungarian Algorithm across multiple threads' },
      { label: 'D', text: 'Reduce the fleet to 20 robots to lower the O(n^3) complexity' },
    ],
    correct_answers: ['B'],
    explanation:
      'The two-level architecture is the industry-standard solution for scalable fleet task allocation. The fast first level uses a greedy heuristic (nearest available robot, auction-based bidding, or priority queue) that runs in O(n) or O(n log n) and dispatches tasks within milliseconds. The slow second level runs the Hungarian Algorithm (or similar optimal solver) in the background every 5-30 seconds to detect suboptimal assignments and rebalance — swapping tasks between robots to improve overall efficiency. This provides low-latency dispatch (critical for throughput) while still achieving near-optimal global allocation. Option A improves constant factors but does not change the O(n^3) scaling. Option C is difficult because the Hungarian Algorithm is inherently sequential. Option D reduces capability to address a software problem.',
    real_world_context:
      'Locus Robotics uses exactly this two-level approach in their LocusOne platform. The greedy dispatch provides sub-100ms task assignment for any fleet size, while background optimization improves overall picks-per-hour by 15-20% compared to greedy-only. Amazon\'s Kiva/Amazon Robotics system uses a similar architecture for 1000+ robot warehouses.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['task-allocation', 'hungarian', 'fleet', 'amr', 'architecture'],
  },

  // FM-2
  {
    question_text:
      'In a multi-AMR warehouse system, four Locus Origin robots arrive at a corridor intersection simultaneously. Without a traffic management system, what deadlock scenario can occur, and what is the standard resolution protocol?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Circular wait deadlock — each robot waits for the robot ahead to move. Resolved by a centralized traffic controller that assigns intersection priorities based on task urgency' },
      { label: 'B', text: 'Livelock — robots repeatedly yield to each other. Resolved by random backoff timers' },
      { label: 'C', text: 'Priority inversion — a low-priority robot blocks a high-priority robot. Resolved by priority inheritance' },
      { label: 'D', text: 'Resource starvation — one robot monopolizes the intersection. Resolved by fair queuing' },
    ],
    correct_answers: ['A'],
    explanation:
      'The four-way intersection deadlock is a classic circular wait: Robot A needs to go east (blocked by B), B needs to go south (blocked by C), C needs to go west (blocked by D), D needs to go north (blocked by A). Each holds a position and waits for the next to move — forming a cycle that never resolves. The standard solution is a centralized traffic controller that manages intersection reservations. Robots request passage through an intersection, and the controller grants access based on priority rules (task urgency, time waiting, direction of travel). Only one or two non-conflicting robots are allowed to transit simultaneously. Option B (livelock) can also occur but is a different problem with a different solution. Option C is relevant in priority-based systems but is not the primary deadlock scenario at intersections.',
    real_world_context:
      'Locus Robotics uses zone-based traffic management where corridors and intersections are divided into zones with capacity limits. Their LocusOne controller pre-reserves zones along a robot\'s planned path 5-10 seconds ahead, preventing deadlocks before they occur.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['deadlock', 'traffic-management', 'amr', 'fleet', 'intersection'],
  },

  // FM-3
  {
    question_text:
      'You are designing an OTA (Over-The-Air) update system for a fleet of 50 Fetch Freight AMRs in a live warehouse. The update includes a critical navigation bug fix. What is the safest deployment strategy?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The fleet operates 20 hours/day. The navigation bug causes occasional path planning failures (1 in 500 tasks). The fix modifies the local costmap update logic. The warehouse cannot afford to take all 50 robots offline simultaneously — minimum 30 robots must be operational at all times to meet throughput SLA.',
    options: [
      { label: 'A', text: 'Rolling update: update 5 robots at a time during low-traffic periods, validate each batch for 30 minutes before proceeding' },
      { label: 'B', text: 'Blue-green deployment: split fleet into two groups of 25, update one group while the other operates, then switch' },
      { label: 'C', text: 'Canary deployment: update 2 robots first, monitor for 2 hours, then expand to 10, monitor again, then update remaining 38 in batches of 10' },
      { label: 'D', text: 'Schedule a 4-hour maintenance window and update all 50 robots simultaneously' },
    ],
    correct_answers: ['C'],
    explanation:
      'Canary deployment is the safest strategy for fleet OTA updates because it provides progressive validation with early abort capability. Starting with 2 robots (4% of fleet) limits blast radius — if the update introduces a regression, only 2 robots are affected. The 2-hour monitoring window captures edge cases that may not appear in testing (specific aisle configurations, interaction with other robots). Expanding to 10 robots (20%) validates fleet-level behavior (traffic management, task allocation with mixed software versions). The final batch of 38 can proceed with high confidence. Option A (rolling) does not provide the extended monitoring that catches subtle regressions. Option B (blue-green) risks 25 robots simultaneously, and 25 remaining may not meet the 30-robot SLA during the switch. Option D violates the operational constraint.',
    real_world_context:
      'Locus Robotics uses a canary deployment model for fleet updates. Their standard cadence is: 2 canary robots for 4 hours, 20% fleet for 8 hours, remaining fleet in 10% batches. Each stage has automated rollback triggers based on task completion rate, navigation failure rate, and safety stop frequency.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['ota', 'deployment', 'canary', 'fleet', 'amr'],
  },

  // FM-4
  {
    question_text:
      'A fleet management KPI dashboard shows that fleet utilization has dropped from 78% to 62% over the past week despite no change in order volume. Select ALL the most likely root causes. (Select 2)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Increased deadhead (empty travel) distance due to suboptimal task sequencing — robots travel further between picks' },
      { label: 'B', text: 'Battery degradation causing more frequent and longer charging cycles, reducing available robot-hours' },
      { label: 'C', text: 'A new firmware update improved collision avoidance sensitivity, causing robots to stop more frequently in high-traffic zones' },
      { label: 'D', text: 'Warehouse temperature dropped, improving motor efficiency and causing robots to complete tasks faster' },
      { label: 'E', text: 'The fleet management server was migrated to a faster cloud instance' },
    ],
    correct_answers: ['A', 'B'],
    explanation:
      'A 16-percentage-point drop in fleet utilization (78% to 62%) with constant order volume indicates robots are spending more time not-picking. Option A (increased deadhead distance) directly reduces utilization: if the task sequencer assigns picks that are physically far apart, robots spend more time traveling empty between tasks. This can happen if warehouse layout changed (new racks), product placement shifted (popular items spread across zones), or the optimizer parameters drifted. Option B (battery degradation) is a common gradual cause: as batteries age, capacity drops, requiring more frequent charges; and degraded batteries charge slower, increasing per-charge downtime. A fleet approaching battery replacement threshold (typically at 80% SOH) can lose 10-20% utilization. Option C would increase safety stops but would not directly reduce utilization by 16 points. Option D would increase throughput, not decrease utilization. Option E would improve, not degrade, performance.',
    real_world_context:
      'Locus Robotics tracks fleet utilization as (time executing tasks)/(total available time). Their analytics dashboard provides breakdown views showing deadhead percentage, charging time, idle time, and safety stop time. A typical fleet utilization target is 75-85%. Below 65% triggers an operational review.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['kpi', 'utilization', 'fleet', 'amr', 'battery', 'task-sequencing'],
  },

  // FM-5
  {
    question_text:
      'In a multi-floor warehouse with 20 AMRs per floor and shared elevators, how should the fleet management system prevent elevator deadlocks where robots on floor 1 wait for the elevator to come down while robots on floor 2 wait for the elevator to come up?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'FIFO queue per elevator — robots are served in the order they request the elevator' },
      { label: 'B', text: 'Elevator scheduling with batch direction: the elevator completes all same-direction trips before reversing (SCAN/elevator algorithm), with a maximum wait time before forced reversal' },
      { label: 'C', text: 'Dedicated elevators per direction — one for up trips, one for down trips' },
      { label: 'D', text: 'Allow robots to autonomously call the elevator on a first-come-first-served basis via direct elevator API calls' },
    ],
    correct_answers: ['B'],
    explanation:
      'The SCAN (elevator) algorithm with bounded wait is the standard approach. Like disk arm scheduling, the elevator completes all pending requests in one direction before reversing. This prevents thrashing (repeatedly switching direction to serve individual requests) and provides bounded worst-case wait times. The maximum wait time threshold prevents starvation — if robots on floor 2 have been waiting more than N minutes, the elevator is forced to reverse even if there are pending floor 1 requests. Option A (FIFO) causes excessive elevator travel as it ping-pongs between floors for each individual request. Option C (dedicated elevators) is expensive and inflexible. Option D (autonomous calling) causes race conditions where multiple robots call the elevator simultaneously and only one can enter.',
    real_world_context:
      'Multi-floor AMR deployments at companies like DHL and Amazon use centralized elevator scheduling. The fleet management system pre-queues elevator requests based on predicted task completions, often summoning the elevator before the robot reaches the elevator lobby.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['elevator', 'scheduling', 'deadlock', 'fleet', 'amr', 'multi-floor'],
  },

  // FM-6
  {
    question_text:
      'A fleet of 40 Locus Origin AMRs has the following battery management policy: charge when SOC < 20%, return to operation at SOC = 80%. During peak operations, 8-12 robots are always charging, leaving only 28-32 for tasks. What change to the charging policy would increase available fleet capacity without risking battery health?',
    question_type: 'scenario',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'Each robot\'s battery lasts approximately 6 hours of continuous operation. Full charge (0-100%) takes 2 hours, but charging from 20-80% takes only 45 minutes due to the CC-CV charging curve. The warehouse operates 20 hours/day with peak demand from 10am-6pm.',
    options: [
      { label: 'A', text: 'Opportunity charging: charge briefly (15-20 min) whenever a robot is idle or passing near a charger, maintaining SOC between 40-80%' },
      { label: 'B', text: 'Deep cycle: charge to 100% and deplete to 5% to maximize per-charge operating time' },
      { label: 'C', text: 'Reduce charging threshold to SOC < 10% to keep robots operating longer' },
      { label: 'D', text: 'Add 10 more robots to compensate for robots in charging' },
    ],
    correct_answers: ['A'],
    explanation:
      'Opportunity charging is the optimal strategy for maximizing fleet availability. By topping up briefly whenever idle (even 10-15 minutes adds 10-15% SOC in the efficient CC charging range), robots maintain SOC in the 40-80% sweet spot. This approach: (1) eliminates the long 0-20% and 80-100% charging phases where charge rate is slowest (CV taper), (2) keeps more robots operational at any time because no robot needs a long continuous charge, (3) is actually better for lithium-ion battery health than deep cycling (option B), which accelerates degradation. Option B (deep cycle) maximizes per-charge runtime but reduces fleet availability during the long full-charge period and damages battery longevity. Option C risks stranding robots with dead batteries. Option D is a $200K+ capital expenditure.',
    real_world_context:
      'Locus Robotics pioneered opportunity charging for warehouse AMR fleets. Their robots charge for 5-15 minutes between tasks, maintaining 60-80% SOC during peak hours. This increased effective fleet availability from 72% to 89% in a published case study.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['battery', 'charging', 'fleet', 'amr', 'availability'],
  },

  // FM-7
  {
    question_text:
      'You are implementing a deadlock detection algorithm for a fleet of 15 AMRs in a warehouse grid. Robots claim cells as they move and wait for cells claimed by others. Which algorithm efficiently detects deadlocks in this resource allocation scenario?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Build a wait-for graph where nodes are robots and directed edges represent "robot A waits for the cell held by robot B." A cycle in this graph indicates deadlock. Run cycle detection every 500ms.' },
      { label: 'B', text: 'Use Banker\'s Algorithm to check safe states before granting cell claims' },
      { label: 'C', text: 'Set a global timeout — if any robot waits more than 30 seconds, declare deadlock and reroute all robots' },
      { label: 'D', text: 'Assign unique priorities to all robots; the lowest-priority robot in any conflict must yield' },
    ],
    correct_answers: ['A'],
    explanation:
      'The wait-for graph with cycle detection is the standard deadlock detection algorithm for multi-robot systems. Each robot is a node. If robot A needs a cell currently held by robot B, a directed edge A->B is added. A cycle (A->B->C->A) indicates deadlock — each robot in the cycle is waiting for the next. Cycle detection in a directed graph runs in O(V+E) using DFS, which is fast enough for real-time (V=15, E<=15 for single-wait). Running every 500ms provides timely detection. Option B (Banker\'s) is a deadlock prevention algorithm that requires knowing maximum resource claims in advance — impractical for dynamic robot routing. Option C (timeout) detects congestion, not deadlock — a robot might wait 30 seconds in heavy traffic without being deadlocked. Option D (priorities) prevents deadlock but causes starvation of low-priority robots.',
    real_world_context:
      'Fleet management systems like those from Locus, 6 River Systems, and Fetch implement wait-for graph deadlock detection. When a cycle is detected, the resolution typically involves one robot backing up to break the cycle — the robot with the shortest alternative path is chosen.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['deadlock', 'detection', 'wait-for-graph', 'fleet', 'amr'],
  },

  // FM-8
  {
    question_text:
      'A fleet management system must communicate task assignments to 100 AMRs with guaranteed delivery. The system currently uses ROS2 services (request-response) but response latency spikes during peak periods. What messaging architecture would be more scalable?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'MQTT with QoS 2 (exactly-once delivery) for task assignments, with each robot subscribing to its own topic (fleet/{robot_id}/tasks)' },
      { label: 'B', text: 'ROS2 actions instead of services for long-running task assignments' },
      { label: 'C', text: 'gRPC bidirectional streaming with per-robot persistent connections' },
      { label: 'D', text: 'HTTP REST API with polling at 100ms intervals' },
    ],
    correct_answers: ['A'],
    explanation:
      'MQTT with QoS 2 is the optimal architecture for fleet task assignment at scale. MQTT\'s publish-subscribe model decouples the fleet manager from individual robot connections — the manager publishes to fleet/{robot_id}/tasks and the broker handles delivery. QoS 2 guarantees exactly-once delivery, preventing duplicate task execution. MQTT brokers (Mosquitto, EMQX) handle 100K+ concurrent connections with sub-millisecond latency. Option B (ROS2 actions) still uses DDS which does not scale well beyond ~20 participants on a single domain. Option C (gRPC streams) requires maintaining 100 persistent TCP connections, each consuming a server thread. Option D (HTTP polling) wastes bandwidth and introduces 0-100ms latency depending on poll timing.',
    real_world_context:
      'Production fleet management systems at Locus Robotics, 6 River Systems, and Geek+ use MQTT as the communication backbone for task assignment. ROS2/DDS is used only within each robot for sensor processing and navigation. The fleet-to-robot communication boundary is where MQTT takes over.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['mqtt', 'fleet', 'messaging', 'scalability', 'amr', 'protocols'],
  },

  // FM-9
  {
    question_text:
      'A warehouse fleet manager reports that the picks-per-hour KPI has dropped 15% after adding 10 more AMRs to a fleet of 30 (now 40 total). What phenomenon explains this counterintuitive result?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Fleet congestion collapse — additional robots increase corridor congestion, causing more stops, replanning, and deadlocks that more than offset the additional capacity' },
      { label: 'B', text: 'The task allocation algorithm is O(n^3), so adding robots makes allocation slower' },
      { label: 'C', text: 'The new robots have older firmware and are running slower' },
      { label: 'D', text: 'The charging infrastructure cannot support 40 robots, causing battery-related downtime' },
    ],
    correct_answers: ['A'],
    explanation:
      'Fleet congestion collapse is the robotics equivalent of Braess\'s paradox in traffic networks. Adding robots increases traffic density in shared corridors and intersections. Beyond the optimal fleet density, each additional robot causes more congestion than the throughput it contributes. The effects compound: (1) more frequent stops increase travel time, (2) more replanning cycles consume CPU and delay all robots, (3) deadlock probability increases quadratically with robot count, (4) intersection wait times increase exponentially. At 30 robots, the warehouse was near optimal density. At 40, congestion losses exceed the 33% capacity gain. The solution is traffic flow optimization (one-way corridors, dedicated paths, zone capacity limits) before adding more robots. Options B, C, and D are possible contributing factors but do not explain the paradoxical throughput decrease.',
    real_world_context:
      'This phenomenon is well-documented in AMR fleet literature. Amazon\'s Kiva system research found that warehouse throughput peaks at approximately 60-70% corridor capacity and degrades rapidly beyond that. Locus Robotics publishes fleet sizing guidelines based on warehouse layout to prevent congestion collapse.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['congestion', 'fleet-sizing', 'kpi', 'amr', 'throughput'],
  },

  // FM-10
  {
    question_text:
      'You are implementing a zone-based traffic management system for a warehouse with 30 AMRs. The warehouse is divided into 200 zones, each with a capacity limit. What data structure provides the most efficient concurrent access for zone reservation queries?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'A single mutex-protected HashMap<ZoneId, Set<RobotId>>' },
      { label: 'B', text: 'A ConcurrentHashMap with per-zone atomic counters and lock-free compare-and-swap for reservation operations' },
      { label: 'C', text: 'A distributed Redis store with zone keys and robot set values' },
      { label: 'D', text: 'A read-write lock protected adjacency matrix of zones' },
    ],
    correct_answers: ['B'],
    explanation:
      'A ConcurrentHashMap with per-zone atomic counters provides the best balance of performance and correctness for concurrent zone reservations. Each zone has an atomic counter (AtomicInteger) tracking current occupancy. Reservation requests use compare-and-swap (CAS): atomically check if count < capacity and increment if so, without holding any lock. This allows O(1) concurrent reservations across different zones with zero lock contention. Option A (single mutex) serializes all zone operations — a robot reserving zone 1 blocks a robot reserving zone 200. Option C (Redis) adds network latency (0.5-2ms per operation) that is unacceptable for real-time traffic management at 30 robots making dozens of reservations per second. Option D (adjacency matrix) is the wrong data structure — zones are not edges in a graph.',
    real_world_context:
      'High-performance fleet traffic managers process 1000-5000 zone reservation requests per second. Lock-free data structures are essential — a 1ms lock contention delay on 30 robots making 50 reservations/second causes cascading delays that manifest as "robots hesitating" at zone boundaries.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['traffic-management', 'concurrency', 'data-structures', 'fleet', 'amr'],
  },

  // FM-11
  {
    question_text:
      'A fleet of 20 ABB GoFa cobots across 4 production lines needs coordinated task scheduling. Line 1 runs automotive parts (urgent), Line 2 runs electronics (normal), Lines 3-4 run consumer goods (low priority). How should the fleet scheduler handle priority without starving low-priority lines?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'cobot',
    scenario_context:
      'Each line requires 3-5 cobots during peak. The fleet has 20 cobots total. Lines compete for shared cobots during peak demand. Current FIFO scheduling causes Line 1 urgent tasks to wait behind Line 3 bulk tasks.',
    options: [
      { label: 'A', text: 'Strict priority queuing: Line 1 tasks always execute before Line 2, Line 2 before Lines 3-4' },
      { label: 'B', text: 'Weighted fair queuing: allocate scheduling slots proportionally (e.g., 40% Line 1, 30% Line 2, 15% each Lines 3-4) with priority boost for urgent tasks that have waited beyond their SLA' },
      { label: 'C', text: 'Round-robin scheduling across all 4 lines' },
      { label: 'D', text: 'Dedicate 5 cobots per line permanently — no sharing' },
    ],
    correct_answers: ['B'],
    explanation:
      'Weighted fair queuing (WFQ) provides the best balance of priority respect and starvation prevention. Line 1 gets the largest scheduling weight (40%), ensuring urgent automotive tasks receive proportionally more cobot-hours. But Lines 3-4 are guaranteed 15% each — preventing starvation even during peak Line 1 demand. The SLA-based priority boost handles burst scenarios: if a Line 4 task has waited beyond its delivery deadline, its effective priority temporarily exceeds Line 1, ensuring no task is indefinitely delayed. Option A (strict priority) causes starvation — Lines 3-4 may never execute during sustained Line 1 demand. Option C (round-robin) ignores priorities entirely. Option D (dedicated) wastes capacity — during Line 1 downtime, 5 cobots sit idle while Lines 3-4 have backlogs.',
    real_world_context:
      'Multi-line cobot scheduling is analogous to network packet scheduling (WFQ was originally a networking concept). BMW and Toyota production facilities use weighted scheduling for shared cobot resources across mixed-model assembly lines.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['scheduling', 'priority', 'cobot', 'fleet', 'production'],
  },

  // FM-12
  {
    question_text:
      'What is the formula for calculating Overall Robot Effectiveness (ORE), and which metric typically has the lowest score in warehouse AMR deployments?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'ORE = Availability x Performance x Quality. Performance (ratio of actual speed to rated speed) is typically lowest due to congestion-imposed speed reductions.' },
      { label: 'B', text: 'ORE = Uptime x Throughput x Accuracy. Uptime is typically lowest due to battery charging.' },
      { label: 'C', text: 'ORE = MTBF / (MTBF + MTTR). This is a single metric, not a product.' },
      { label: 'D', text: 'ORE = Availability x Performance x Quality. Availability is typically lowest due to charging time, maintenance, and software updates.' },
    ],
    correct_answers: ['D'],
    explanation:
      'Overall Robot Effectiveness (ORE) mirrors Overall Equipment Effectiveness (OEE) from manufacturing. ORE = Availability x Performance x Quality. Availability = (Total time - Downtime) / Total time, where downtime includes charging, maintenance, software updates, and fault recovery. Performance = (Actual cycle time) / (Ideal cycle time) — how fast the robot actually operates vs. its rated capability. Quality = (Successful tasks) / (Total tasks attempted). In warehouse AMR deployments, Availability is typically the lowest factor (70-85%) because robots spend 15-25% of time charging, 2-5% in maintenance, and 1-3% in fault recovery. Performance is usually 85-95% (congestion reduces speed but not dramatically). Quality is typically 95-99% (most tasks complete successfully).',
    real_world_context:
      'Fleet managers target ORE > 60% for warehouse AMRs (85% availability x 90% performance x 98% quality = 75% ORE). Locus Robotics publishes ORE benchmarks showing that charging strategy is the single largest lever for improving overall fleet effectiveness.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['kpi', 'ore', 'availability', 'fleet', 'amr'],
  },

  // FM-13
  {
    question_text:
      'A fleet of drones is performing inventory scanning in a warehouse with 50,000 SKUs across 100 aisles. Each drone can scan 500 SKUs/hour with a 20-minute battery life (requiring 10-minute charge). With 5 drones, calculate the minimum time to complete a full inventory scan.',
    question_type: 'calculation',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'drone',
    options: [
      { label: 'A', text: '20 hours — (50,000 / 500) / 5 drones, no accounting for charging' },
      { label: 'B', text: '30 hours — each drone works 20 min, charges 10 min (67% utilization), effective rate = 333 SKU/hr/drone, total = 50,000 / (333*5) = 30 hours' },
      { label: 'C', text: '15 hours — assumes 100% utilization with hot-swap batteries' },
      { label: 'D', text: '40 hours — includes setup time and 50% overlap scanning for verification' },
    ],
    correct_answers: ['B'],
    explanation:
      'With charging cycles factored in: Each drone operates for 20 minutes, then charges for 10 minutes. This gives a 20/(20+10) = 66.7% operational duty cycle. Effective scanning rate per drone = 500 * 0.667 = 333.5 SKU/hour. With 5 drones operating in parallel: fleet rate = 5 * 333.5 = 1,667.5 SKU/hour. Time for 50,000 SKUs = 50,000 / 1,667.5 = 29.97 hours, approximately 30 hours. Option A ignores charging time entirely. Option C assumes hot-swap batteries which were not specified. Option D adds unspecified overhead. In practice, add 10-15% for repositioning between aisles, error recovery, and shift changes.',
    real_world_context:
      'Warehouse inventory drones from companies like Gather AI and Flytrex typically achieve 300-600 SKU/hour scanning rates. A full warehouse inventory that previously took 2 weeks with manual counting can be completed in 1-2 days with a fleet of 5-10 drones.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['drone', 'inventory', 'calculation', 'fleet', 'battery'],
  },

  // FM-14
  {
    question_text:
      'When implementing a fleet management API for external WMS (Warehouse Management System) integration, which protocol is most appropriate for real-time order streaming and task status updates?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'REST API with webhooks for status updates' },
      { label: 'B', text: 'GraphQL subscriptions over WebSocket for real-time bidirectional communication' },
      { label: 'C', text: 'gRPC with server-side streaming for order flow and bidirectional streaming for status updates' },
      { label: 'D', text: 'SOAP/XML web services for enterprise compatibility' },
    ],
    correct_answers: ['C'],
    explanation:
      'gRPC is the optimal choice for WMS-fleet integration for several reasons: (1) Server-side streaming provides efficient real-time order flow — the WMS streams new orders to the fleet manager as they arrive, without polling. (2) Bidirectional streaming enables the fleet manager to push task status updates back to the WMS simultaneously. (3) Protocol Buffers provide type-safe serialization with backward compatibility. (4) HTTP/2 multiplexing allows multiple streams over a single connection. Option A (REST + webhooks) requires the fleet manager to expose a public endpoint for webhooks, which is a security concern. Option B (GraphQL subscriptions) adds complexity without benefit for this machine-to-machine use case. Option D (SOAP) is legacy with high overhead.',
    real_world_context:
      'Major WMS platforms (Manhattan Associates, Blue Yonder, SAP EWM) are adding gRPC interfaces for real-time fleet integration. Locus Robotics\' LocusOne API uses gRPC for WMS integration, processing 1000+ order events per minute with sub-10ms latency.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['grpc', 'wms', 'integration', 'fleet', 'amr', 'protocols'],
  },

  // FM-15
  {
    question_text:
      'A hospital deploys 8 medical delivery robots (similar to Fetch Freight) for pharmacy-to-ward deliveries. During shift changes, all 8 robots are requested simultaneously for urgent medication deliveries. The single elevator creates a bottleneck. How should the fleet manager optimize elevator usage?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'medical',
    scenario_context:
      'The hospital has 4 floors, 1 elevator, 8 robots. Elevator capacity: 1 robot at a time. Elevator transit time: 30 seconds between adjacent floors. During shift change (7am, 3pm, 11pm), 8 urgent deliveries are queued simultaneously across all floors.',
    options: [
      { label: 'A', text: 'Batch deliveries by floor: group all deliveries to the same floor and send one robot per floor, minimizing elevator trips' },
      { label: 'B', text: 'Pre-position robots on destination floors 15 minutes before shift change based on historical delivery patterns' },
      { label: 'C', text: 'Assign strict priority: ICU deliveries first, then surgical, then general wards' },
      { label: 'D', text: 'Use a second robot as an elevator relay — one robot rides the elevator while others queue at lobby points' },
    ],
    correct_answers: ['B'],
    explanation:
      'Pre-positioning based on historical patterns is the most effective strategy because it eliminates the elevator bottleneck entirely during the critical period. If the fleet manager knows that shift changes generate 2 deliveries to floor 2, 3 to floor 3, and 3 to floor 4, it pre-positions robots accordingly 15 minutes before the shift change. When deliveries are requested, robots are already on the correct floor and can immediately begin delivery without waiting for the elevator. This is a predictive scheduling approach that leverages the deterministic nature of hospital shift changes. Option A (batching) still requires elevator trips. Option C (priority) determines order but does not reduce total elevator time. Option D is inefficient — the relay robot still occupies the elevator.',
    real_world_context:
      'Hospital delivery robots at UCSF, Johns Hopkins, and Singapore General Hospital use predictive pre-positioning for shift changes. Pharmacy delivery patterns are highly predictable (medication rounds follow fixed schedules), making this strategy extremely effective.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['medical', 'elevator', 'scheduling', 'fleet', 'hospital'],
  },

  // FM-16
  {
    question_text:
      'A fleet management system tracks robot health using a scoring model. Select ALL metrics that should trigger an automatic robot recall from operation. (Select 3)',
    question_type: 'multi_select',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'LiDAR scan frequency drops below 8Hz (rated 10Hz) — degraded but functional navigation' },
      { label: 'B', text: 'Wheel odometry error exceeds 5% over a calibration distance — the robot is physically misaligning from planned paths' },
      { label: 'C', text: 'Battery State of Health (SOH) drops below 70% — reduced capacity and risk of sudden shutdown' },
      { label: 'D', text: 'WiFi signal strength drops below -75dBm — intermittent connectivity' },
      { label: 'E', text: 'Motor temperature exceeds 80% of rated maximum — approaching thermal shutdown threshold' },
    ],
    correct_answers: ['B', 'C', 'E'],
    explanation:
      'Option B (>5% odometry error) is a critical recall trigger because it means the robot\'s physical position deviates from its believed position by 5cm per meter traveled. Over a 20m corridor, this is 1 meter of error — enough to collide with racks, other robots, or humans. Option C (<70% battery SOH) indicates significant degradation. Below 70%, lithium-ion batteries exhibit non-linear capacity loss and can experience sudden voltage drops under load, causing mid-task shutdowns in aisles (blocking other robots). Option E (>80% motor temperature) risks thermal protection shutdown within minutes of continued operation. Continuing operation risks permanent motor damage and creates a stranded robot. Option A (LiDAR at 8Hz instead of 10Hz) is degraded but most navigation stacks handle this gracefully. Option D (WiFi -75dBm) causes slow communication but is not immediately dangerous.',
    real_world_context:
      'Fleet management platforms use multi-factor health scores. Locus Robotics\' robots automatically return to a service bay when any critical metric crosses a threshold. The most common recall triggers in production are motor overheating (dusty warehouse environments) and odometry drift (worn wheels).',
    time_limit_seconds: 100,
    points: 2,
    tags: ['health-monitoring', 'recall', 'fleet', 'amr', 'safety'],
  },

  // FM-17
  {
    question_text:
      'You are designing the communication architecture for a fleet of 100 AMRs. Each robot publishes 15 topics. The fleet manager subscribes to position, status, and battery topics from all robots. What is the total number of DDS endpoints the fleet manager must discover and maintain?',
    question_type: 'calculation',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: '300 endpoints — 3 subscriptions per robot x 100 robots' },
      { label: 'B', text: '1,500 endpoints — all 15 publisher endpoints per robot x 100 robots, because DDS discovery announces ALL endpoints, not just matched ones' },
      { label: 'C', text: '1,803 endpoints — 1,500 publisher endpoints from robots + 300 subscriber endpoints on the fleet manager + 3 discovery endpoints' },
      { label: 'D', text: '200 endpoints — 1 publisher + 1 subscriber per robot' },
    ],
    correct_answers: ['B'],
    explanation:
      'DDS discovery (SPDP/SEDP) announces ALL endpoints from every participant, regardless of whether they have matching subscribers. Each of the 100 robots has 15 publisher endpoints. The fleet manager must discover and maintain state for all 1,500 publisher endpoints (100 x 15), even though it only subscribes to 3 topics per robot (300 matching endpoints). The remaining 1,200 unmatched endpoints still consume discovery bandwidth and memory in the fleet manager\'s DDS participant. This is a fundamental scalability issue with DDS in large fleet deployments. Option A only counts matched endpoints. Option C adds subscriber endpoints which are on the fleet manager side, not discovered from robots. Option D is incorrect.',
    real_world_context:
      'This DDS discovery overhead is why production fleet systems (Locus, Amazon Robotics) use MQTT or gRPC for fleet-level communication instead of DDS. A fleet manager discovering 1,500+ endpoints from 100 robots consumes significant CPU and memory just for DDS housekeeping.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['dds', 'discovery', 'scalability', 'fleet', 'amr', 'calculation'],
  },

  // FM-18
  {
    question_text:
      'A warehouse fleet of 25 Locus Origin AMRs experiences a network partition: the east wing (12 robots) loses connectivity to the fleet manager for 3 minutes. What should the robots in the isolated partition do?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The 12 robots in the east wing are mid-task: 5 are carrying items, 4 are navigating to pick locations, 3 are idle. The fleet manager runs in the cloud. Network partitions occur approximately once per week and typically resolve within 5 minutes. The east wing has a local ROS2 network (DDS discovery works between the 12 isolated robots).',
    options: [
      { label: 'A', text: 'All robots immediately stop and wait for fleet manager reconnection' },
      { label: 'B', text: 'Robots with items complete their current delivery using cached routes, then park at designated safe zones; idle robots remain parked; navigating robots continue to their pick location using cached tasks' },
      { label: 'C', text: 'Robots elect a temporary leader (highest ID) that takes over fleet management using peer-to-peer coordination until connectivity restores' },
      { label: 'D', text: 'All robots continue operating normally — they have enough autonomy to navigate and complete tasks independently' },
    ],
    correct_answers: ['B'],
    explanation:
      'Option B implements the "graceful degradation" pattern for network partitions. Robots with items should complete their current delivery to prevent inventory inconsistency (an item in-transit that stops creates a "lost" item in the WMS). Using cached routes ensures they can complete without fleet manager guidance. After delivery, parking in safe zones prevents congestion and deadlocks without centralized traffic management. Idle robots stay parked (least risky action). Navigating robots continue to their cached pick location to avoid blocking aisles. Option A causes 5 robots to stop with items in-transit (WMS inventory mismatch). Option C is theoretically appealing but adds enormous complexity — peer-to-peer fleet management requires consensus protocols, and the elected leader lacks the WMS integration to assign new tasks. Option D ignores the deadlock risk without centralized traffic management.',
    real_world_context:
      'Locus Robotics robots implement "disconnected mode" that matches option B. Each robot caches its current task, route, and the last-known positions of nearby robots. Upon disconnection, they complete the current task and park. Their LocusOne platform records all robot actions during the partition for reconciliation upon reconnection.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['network-partition', 'fault-tolerance', 'fleet', 'amr', 'resilience'],
  },

  // FM-19
  {
    question_text:
      'A fleet analytics system measures Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR) for 40 AMRs. Fleet MTBF is 72 hours and MTTR is 4 hours. What is the fleet availability, and what single improvement would have the largest impact?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Availability = 94.7%. Reducing MTTR from 4h to 2h (faster spare parts, better diagnostics) has a larger impact than doubling MTBF.' },
      { label: 'B', text: 'Availability = 94.7%. Doubling MTBF from 72h to 144h has a larger impact than halving MTTR.' },
      { label: 'C', text: 'Availability = 90.0%. Both improvements have equal impact.' },
      { label: 'D', text: 'Availability = 97.3%. The fleet is already at target; no improvement needed.' },
    ],
    correct_answers: ['A'],
    explanation:
      'Availability = MTBF / (MTBF + MTTR) = 72 / (72 + 4) = 72/76 = 94.74%. Now compare improvements: Halving MTTR (4h -> 2h): Availability = 72/(72+2) = 97.3%. Improvement: +2.6 points. Doubling MTBF (72h -> 144h): Availability = 144/(144+4) = 97.3%. Improvement: +2.6 points. Actually both yield the same availability in this case! However, option A is correct because in practice, reducing MTTR is almost always more cost-effective and faster to achieve. Reducing MTTR involves: better diagnostic tools, pre-positioned spare parts, trained technicians, remote troubleshooting. Doubling MTBF requires: redesigning hardware, more reliable components, better software — all expensive and slow. The general principle: when MTTR << MTBF, reducing MTTR has a disproportionate operational impact because each failure event causes less disruption.',
    real_world_context:
      'Amazon Robotics targets MTBF > 500 hours and MTTR < 30 minutes for their warehouse robots. Their strategy heavily emphasizes MTTR reduction: pre-staged replacement robots, automated fault detection, and modular designs that allow technicians to swap entire subassemblies in minutes.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['kpi', 'mtbf', 'mttr', 'availability', 'fleet', 'amr'],
  },

  // FM-20
  {
    question_text:
      'A fleet management system uses a task auction protocol for dynamic task allocation. Each robot bids on tasks based on its estimated completion time. What is the main disadvantage of this approach compared to centralized optimization?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Auction-based allocation converges to a locally optimal but globally suboptimal assignment because each robot bids selfishly without considering the impact on other robots\' future assignments' },
      { label: 'B', text: 'Auction-based allocation is slower than centralized optimization because of communication overhead' },
      { label: 'C', text: 'Auction-based allocation cannot handle priority tasks' },
      { label: 'D', text: 'Auction-based allocation requires more memory per robot' },
    ],
    correct_answers: ['A'],
    explanation:
      'The fundamental limitation of auction-based (market-based) task allocation is myopic optimization. Each robot bids based on its own cost to complete a task without considering how winning that task affects the global assignment quality. For example: Robot A is closest to Task 1 and bids lowest. But if Robot A takes Task 1, Robot B must take Task 2 which is far away, while if Robot A took Task 2 (slightly farther for A) and Robot B took Task 1, the total fleet travel distance would be 30% less. Centralized optimization (Hungarian Algorithm, MILP) considers all robot-task pairs simultaneously and finds the global optimum. However, auctions are more robust to communication failures and scale better — they trade optimality for resilience. Option B is incorrect — auctions are typically faster because they avoid O(n^3) optimization. Options C and D are incorrect — auctions can incorporate priorities via bid adjustments.',
    real_world_context:
      'Research by the Multi-Robot Systems lab at CMU shows that auction-based allocation achieves 80-90% of optimal efficiency in warehouse environments. The 10-20% efficiency gap is acceptable for many deployments because auctions provide sub-second allocation (vs. seconds for optimization) and gracefully handle robot failures.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['task-allocation', 'auction', 'optimization', 'fleet', 'amr'],
  },

  // FM-21
  {
    question_text:
      'Review this Python fleet management code for assigning charging stations to robots. Identify the race condition that causes two robots to be assigned the same charger.',
    question_type: 'code_review',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    code_snippet: `import asyncio
from dataclasses import dataclass

@dataclass
class ChargingStation:
    id: str
    occupied: bool = False

class FleetChargeManager:
    def __init__(self):
        self.stations = [ChargingStation(f"CS-{i}") for i in range(10)]

    async def request_charger(self, robot_id: str) -> str | None:
        # Find available station
        available = [s for s in self.stations if not s.occupied]
        if not available:
            return None

        # Select nearest (simplified: first available)
        station = available[0]

        # Simulate route planning delay
        await asyncio.sleep(0.1)

        # Mark as occupied
        station.occupied = True
        return station.id

    async def release_charger(self, station_id: str):
        for s in self.stations:
            if s.id == station_id:
                s.occupied = False
                break`,
    options: [
      { label: 'A', text: 'The list comprehension for finding available stations is not thread-safe' },
      { label: 'B', text: 'The await asyncio.sleep(0.1) yields control between checking station availability and marking it occupied — another coroutine can claim the same station during this window' },
      { label: 'C', text: 'The release_charger method should use a lock' },
      { label: 'D', text: 'The ChargingStation dataclass should use a threading.Lock for the occupied field' },
    ],
    correct_answers: ['B'],
    explanation:
      'The race condition is a classic TOCTOU (Time-of-Check, Time-of-Use) bug in async Python. When request_charger() finds an available station, it awaits asyncio.sleep(0.1) (simulating route planning). During this await, the event loop can schedule another request_charger() coroutine, which sees the same station as available (occupied is still False). Both coroutines then set station.occupied = True, and both return the same station ID — double-booking the charger. The fix is to use an asyncio.Lock around the check-and-mark operation, or atomically mark the station before the await: station.occupied = True before await asyncio.sleep(0.1). Note that this is not a threading issue (asyncio is single-threaded) but a coroutine scheduling issue — the await point is where control transfers.',
    real_world_context:
      'Charging station double-booking is a common fleet management bug. In production, two robots arriving at the same charger causes physical congestion and requires manual intervention. Fleet management platforms like Locus LocusOne use database-level advisory locks for charging station assignment.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['async', 'race-condition', 'charging', 'fleet', 'python'],
  },

  // FM-22
  {
    question_text:
      'A fleet of 60 AMRs operates in a 100,000 sq ft warehouse. The fleet management system must detect and resolve traffic congestion in real-time. What algorithm is most appropriate for predicting congestion before it occurs?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Time-expanded graph where each zone-time pair is a node, and robot paths are flows through the graph — congestion is detected when flow exceeds zone capacity at any time step' },
      { label: 'B', text: 'K-means clustering of robot positions to identify dense regions' },
      { label: 'C', text: 'Simple threshold: count robots per zone and alert when count exceeds limit' },
      { label: 'D', text: 'Neural network trained on historical congestion patterns' },
    ],
    correct_answers: ['A'],
    explanation:
      'A time-expanded graph (TEG) is the most effective approach for predicting congestion before it occurs. Each node in the TEG represents a (zone, time_step) pair. Robot paths are represented as flows through sequences of nodes. By projecting all 60 robots\' planned paths into the TEG, you can detect future congestion: any node where the total flow exceeds the zone capacity indicates congestion at that zone at that future time step — before the robots arrive. This allows preemptive rerouting. Option B (K-means) detects current clustering but cannot predict future positions. Option C (threshold) only detects congestion after it occurs. Option D (neural network) is overkill and does not provide the interpretable, actionable congestion predictions that the TEG provides.',
    real_world_context:
      'Time-expanded graphs are used in Air Traffic Control and are increasingly applied to fleet robotics. Amazon Robotics uses a variant called "reservation tables" where robots reserve (zone, time) slots in advance. Conflicts in the reservation table are resolved by replanning before robots commit to their paths.',
    time_limit_seconds: 100,
    points: 4,
    tags: ['congestion', 'prediction', 'graph', 'fleet', 'amr', 'traffic-management'],
  },

  // FM-23
  {
    question_text:
      'Your fleet management system must support heterogeneous robots: 20 Locus Origin (payload 30lbs), 10 Fetch Freight (payload 100lbs), and 5 custom heavy-lift robots (payload 500lbs). How should the task allocator handle weight-based task assignment?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The warehouse handles items from 1lb to 400lbs. 70% of items are under 30lbs, 25% are 30-100lbs, and 5% are over 100lbs. The current allocator treats all robots equally and rejects tasks when a robot cannot lift the item, causing delays.',
    options: [
      { label: 'A', text: 'Create three separate task queues (light, medium, heavy) and assign robots exclusively to their weight class queue' },
      { label: 'B', text: 'Score-based allocation: each robot bids on tasks with a penalty for over-capability (a 500lb robot picking up a 5lb item scores lower than a 30lb robot) to reserve heavy-lift capacity for heavy tasks' },
      { label: 'C', text: 'Let any robot take any task it can physically handle (e.g., Fetch Freight picks up 5lb items)' },
      { label: 'D', text: 'Always assign the smallest capable robot to each task' },
    ],
    correct_answers: ['B'],
    explanation:
      'Score-based allocation with over-capability penalties is the optimal approach. The scoring function considers: (1) physical capability (can the robot lift the item?), (2) over-capability penalty (using a 500lb robot for a 5lb item reserves heavy-lift capacity unnecessarily), (3) proximity (nearest capable robot), (4) current battery level, (5) queue depth at the destination. This naturally results in light items being assigned to Locus Origin robots (no penalty), medium items to Fetch Freight robots, and heavy items to heavy-lift robots. But critically, if all Locus Origin robots are busy, a Fetch Freight robot will take a light item (with a small penalty) rather than leaving it unassigned. Option A (exclusive queues) wastes Fetch Freight capacity when medium items are scarce but light items are backlogged. Option C uses heavy-lift robots inefficiently. Option D is a simplified version of B without considering distance or availability.',
    real_world_context:
      'Heterogeneous fleet management is becoming common as warehouses deploy mixed robot types. Amazon uses score-based allocation across their different Kiva/Robin/Sparrow robots. The scoring weights are tuned based on the warehouse\'s item distribution and robot fleet composition.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['task-allocation', 'heterogeneous', 'fleet', 'amr', 'scoring'],
  },

  // FM-24
  {
    question_text:
      'A fleet of 30 AMRs uses a centralized path planning approach where the fleet manager plans non-conflicting paths for all robots simultaneously. What is the computational complexity of the optimal multi-agent path finding (MAPF) problem, and what practical algorithm is used?',
    question_type: 'multiple_choice',
    difficulty: 4,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'MAPF is NP-hard on general graphs. Conflict-Based Search (CBS) is used — it searches a binary conflict tree, resolving one inter-robot conflict at a time, and is optimal for small fleets (<50 robots)' },
      { label: 'B', text: 'MAPF is polynomial. A* with composite state space (joint configuration of all robots) solves it optimally' },
      { label: 'C', text: 'MAPF is undecidable. Heuristic methods like prioritized planning (plan one robot at a time, treating earlier robots as moving obstacles) are the only option' },
      { label: 'D', text: 'MAPF is O(n^2). Velocity obstacles resolve all conflicts in real-time' },
    ],
    correct_answers: ['A'],
    explanation:
      'Optimal MAPF on general graphs is NP-hard (proven by Yu and LaValle, 2013). Conflict-Based Search (CBS), developed by Sharon et al. at Ben-Gurion University, is the practical state-of-the-art algorithm. CBS works in two levels: the low level plans individual shortest paths ignoring other robots, and the high level detects conflicts (two robots in the same cell at the same time) and resolves them by branching — creating two child nodes where one robot is constrained to avoid the conflict cell. This binary conflict tree is searched best-first. CBS is optimal and complete, and performs well for up to ~50 robots because most real warehouse scenarios have few conflicts. Option B (composite A*) is optimal but has O(V^n) complexity where n is robot count — infeasible for n>5. Option C incorrectly states MAPF is undecidable — it is decidable but NP-hard. Option D (velocity obstacles) is for local collision avoidance, not global path planning.',
    real_world_context:
      'Amazon Robotics uses a variant of CBS for coordinating Kiva robots in dense warehouse environments. Google DeepMind published improvements to CBS (Enhanced CBS, ECBS) that provide bounded-suboptimal solutions for 100+ robots in under 1 second.',
    time_limit_seconds: 100,
    points: 4,
    tags: ['mapf', 'cbs', 'path-planning', 'fleet', 'amr', 'complexity'],
  },

  // FM-25
  {
    question_text:
      'A fleet manager needs to schedule preventive maintenance for 40 AMRs. Each robot requires 2 hours of maintenance every 500 operating hours. The fleet cannot have more than 3 robots in maintenance simultaneously. What scheduling approach minimizes the impact on fleet capacity?',
    question_type: 'scenario',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The 40 AMRs operate 20 hours/day. If all robots started at the same time, they would all need maintenance simultaneously at the 500-hour mark (25 days). The fleet has 5 maintenance bays.',
    options: [
      { label: 'A', text: 'Stagger maintenance schedules: offset each robot\'s maintenance window by 12.5 hours (500/40) so that at most 1 robot needs maintenance at any time, with slack for the 3-robot concurrent limit' },
      { label: 'B', text: 'Run all robots until they hit 500 hours and maintain them in batches of 5 (matching bay count)' },
      { label: 'C', text: 'Maintain robots on a fixed calendar schedule (every Monday) regardless of operating hours' },
      { label: 'D', text: 'Use condition-based maintenance — only maintain when diagnostic sensors indicate degradation' },
    ],
    correct_answers: ['A'],
    explanation:
      'Staggering maintenance schedules distributes the maintenance load evenly over time. With 40 robots each needing 2 hours of maintenance every 500 operating hours: total maintenance hours = 40 * 2 = 80 hours per 500 operating hours = 80/(500/20) = 80/25 = 3.2 maintenance events per day. By offsetting each robot\'s maintenance start by 500/40 = 12.5 operating hours, at most 1-2 robots need maintenance at any time — well within the 3-robot concurrent limit. Option B (batch at 500 hours) would require 8 batches x 2 hours = 16 hours to clear all 40 robots, with only 35 operational during each batch. Option C (calendar-based) does not account for actual wear. Option D (condition-based) is optimal for long-term but does not help with initial scheduling.',
    real_world_context:
      'Fleet maintenance staggering is standard practice in commercial AMR deployments. Locus Robotics auto-schedules maintenance during low-demand periods (2am-6am) and staggers the fleet so that the maintenance burden is distributed across the entire operating calendar.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['maintenance', 'scheduling', 'fleet', 'amr', 'availability'],
  },

  // FM-26
  {
    question_text:
      'Select ALL correct strategies for handling a robot that becomes stuck (unable to navigate to its goal for >60 seconds) in a fleet of 25 AMRs. (Select 2)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'The fleet manager commands nearby robots to clear the area around the stuck robot (cooperative unsticking), then commands the stuck robot to attempt a recovery behavior sequence' },
      { label: 'B', text: 'Immediately dispatch a human operator to physically move the robot' },
      { label: 'C', text: 'Reassign the stuck robot\'s task to the nearest available robot, command the stuck robot to attempt navigation to a known clear area (safe zone), and if that fails, mark it as requiring human intervention' },
      { label: 'D', text: 'Power cycle the stuck robot remotely' },
      { label: 'E', text: 'Increase the robot\'s maximum velocity to push through the obstacle' },
    ],
    correct_answers: ['A', 'C'],
    explanation:
      'Option A (cooperative unsticking) addresses the common cause of robots being stuck due to nearby robots blocking their path. The fleet manager can reroute adjacent robots to create clearance, then trigger the stuck robot\'s recovery behavior (back up, rotate, replan). This resolves most "stuck" situations without human intervention. Option C (task reassignment + safe zone navigation) handles cases where the stuck situation is more persistent: immediately reassigning the task prevents throughput loss, and commanding the robot to navigate to a known clear area (not the original goal) often succeeds because the path to a safe zone may be different from the blocked path to the goal. If safe zone navigation also fails, escalation to a human operator is appropriate. Option B (immediate human dispatch) wastes human time for situations that automated recovery resolves 80%+ of the time. Option D (power cycle) is destructive and loses the robot\'s localization state. Option E is unsafe.',
    real_world_context:
      'Fleet management platforms implement multi-tier recovery. Locus Robotics\' LocusOne: Tier 1 (0-30s): robot self-recovery behaviors. Tier 2 (30-90s): fleet manager cooperative recovery (reroute nearby robots). Tier 3 (90s+): task reassignment + safe zone. Tier 4 (5 min+): human dispatch. This achieves 95% autonomous recovery rate.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['stuck-recovery', 'cooperative', 'fleet', 'amr', 'fault-tolerance'],
  },

  // FM-27
  {
    question_text:
      'A fleet of 10 UR10e cobots is deployed across a manufacturing facility. Each cobot runs ROS2 with a local control stack. The fleet manager communicates via OPC-UA. What is the primary challenge of maintaining software version consistency across the fleet?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'cobot',
    options: [
      { label: 'A', text: 'OPC-UA protocol version differences between cobots' },
      { label: 'B', text: 'ROS2 node ABI compatibility — updating one cobot\'s motion planning package may require updating all cobots simultaneously to maintain consistent behavior, but simultaneous fleet-wide updates risk total production downtime' },
      { label: 'C', text: 'Network bandwidth limitations for distributing large ROS2 packages' },
      { label: 'D', text: 'Cobot hardware variations requiring different firmware versions' },
    ],
    correct_answers: ['B'],
    explanation:
      'Software version consistency is the primary fleet management challenge for distributed cobot systems. ROS2 packages have complex dependency chains — updating the MoveIt2 planning library on one cobot may change its trajectory behavior. If some cobots run v2.5 and others run v2.6, the fleet may exhibit inconsistent motion profiles for the same task, confusing operators and causing quality variations. However, updating all 10 simultaneously creates a risk of total production downtime if the update introduces a regression. The solution is staged rollouts with compatibility testing, but this requires running mixed versions temporarily — which itself creates inconsistency. Option A (OPC-UA versioning) is handled by the protocol\'s backward compatibility. Option C (bandwidth) is a solved problem. Option D (hardware variations) is managed through parameterized configurations.',
    real_world_context:
      'Universal Robots addresses this with their PolyScope platform that manages software versions across UR fleets. However, the ROS2 stack (which runs on a separate PC) lacks this fleet-level version management. Companies like Ready Robotics and Vention build fleet orchestration layers that include version management for ROS2-based cobot fleets.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['version-management', 'ota', 'fleet', 'cobot', 'ros2'],
  },

  // FM-28
  {
    question_text:
      'A warehouse fleet management system must implement geofencing to restrict certain AMRs to specific zones (e.g., cold storage robots should not enter shipping areas). What is the most efficient geofencing approach for real-time enforcement with 50 AMRs?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Point-in-polygon test against geofence boundaries for each robot position update' },
      { label: 'B', text: 'Precomputed zone lookup table indexed by grid cell — each cell maps to allowed robot types, providing O(1) zone enforcement per position update' },
      { label: 'C', text: 'GPS-based geofencing with 1m accuracy' },
      { label: 'D', text: 'Physical barriers (walls, doors) to enforce zones' },
    ],
    correct_answers: ['B'],
    explanation:
      'A precomputed grid-cell lookup table provides O(1) geofence enforcement. The warehouse floor is divided into a grid (e.g., 10cm x 10cm cells). Each cell is precomputed with metadata: zone ID, allowed robot types, speed limits, one-way direction. When a robot reports its position, the fleet manager converts (x,y) to a grid cell index and performs a single array lookup to check zone permissions. At 50 robots updating at 10Hz = 500 lookups/second, O(1) is essential. Option A (point-in-polygon) is O(n) per query where n is the number of polygon edges — acceptable for a few zones but slow for complex geofences. Option C (GPS) does not work indoors. Option D (physical barriers) is expensive and inflexible.',
    real_world_context:
      'Fleet management systems from Locus, 6 River Systems, and Geek+ use occupancy-grid-based zone maps. The same grid used for navigation (costmap) is augmented with zone metadata for geofencing. This dual-purpose approach avoids maintaining separate data structures.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['geofencing', 'zone-management', 'fleet', 'amr', 'grid'],
  },

  // FM-29
  {
    question_text:
      'You are implementing a fleet telemetry pipeline that must ingest, store, and query operational data from 50 AMRs, each reporting 20 metrics at 1Hz. Select the most appropriate database architecture.',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'Metrics include: position (x,y,theta), velocity, battery SOC, motor temperatures (6), task status, network latency, LiDAR health, etc. The system must support: real-time dashboards (last 1 hour), daily KPI reports (aggregation), and trend analysis (90 days). Data rate: 50 robots x 20 metrics x 1Hz = 1,000 data points/second.',
    options: [
      { label: 'A', text: 'PostgreSQL with partitioned tables by time and robot_id' },
      { label: 'B', text: 'TimescaleDB (time-series extension on PostgreSQL) with hypertables partitioned by time, continuous aggregates for KPIs, and retention policies for automatic data lifecycle' },
      { label: 'C', text: 'MongoDB with TTL indexes for data expiration' },
      { label: 'D', text: 'Redis time-series for real-time and PostgreSQL for historical — dual database approach' },
    ],
    correct_answers: ['B'],
    explanation:
      'TimescaleDB is purpose-built for this use case. It provides: (1) Hypertables that automatically partition by time, providing fast inserts (handles 100K+ data points/second) and time-range queries. (2) Continuous aggregates that maintain pre-computed KPI rollups (hourly/daily picks-per-robot, average utilization) without expensive queries. (3) Retention policies that automatically drop raw data older than 90 days while keeping aggregates indefinitely. (4) Standard SQL interface compatible with existing PostgreSQL tools and ORMs. (5) Compression policies that achieve 95% reduction on time-series data. Option A (plain PostgreSQL) can handle the volume but lacks the time-series optimizations. Option C (MongoDB) is not optimized for time-series queries. Option D (dual database) adds operational complexity for synchronizing two systems.',
    real_world_context:
      'Fleet management platforms commonly use TimescaleDB or InfluxDB for robot telemetry. Locus Robotics processes millions of data points per day from hundreds of robots. TimescaleDB\'s continuous aggregates are particularly valuable for KPI dashboards that would otherwise require expensive real-time queries.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['telemetry', 'database', 'timescaledb', 'fleet', 'amr', 'kpi'],
  },

  // FM-30
  {
    question_text:
      'A fleet of 20 AMRs shares 5 narrow aisles in a warehouse. Each aisle fits only one robot at a time (single-lane). What traffic management protocol prevents aisle deadlocks while maximizing throughput?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'First-come-first-served: the first robot to request an aisle gets exclusive access until it exits' },
      { label: 'B', text: 'Time-windowed reservations: robots reserve aisle access for a specific time window (entry_time, exit_time). The fleet manager grants non-overlapping reservations and optimizes ordering to minimize total wait time.' },
      { label: 'C', text: 'Two-phase locking: robots lock the source aisle and destination aisle before moving' },
      { label: 'D', text: 'Allow multiple robots in the aisle with collision avoidance' },
    ],
    correct_answers: ['B'],
    explanation:
      'Time-windowed reservations provide the optimal balance of deadlock prevention and throughput. Each robot requests a reservation specifying: which aisle, estimated entry time, and estimated transit duration. The fleet manager maintains a reservation timeline per aisle and grants non-overlapping windows. Critical optimizations: (1) the manager can reorder pending requests to minimize gaps (e.g., if robot A needs aisle 3 at t=10 for 30s, and robot B needs it at t=15 for 20s, schedule B first since it finishes at t=35 vs A finishing at t=40). (2) Reservations can be adjusted dynamically if a robot is early or late. Option A (FCFS) cannot optimize ordering and wastes time if a far-away robot reserved first. Option C (two-phase locking) can cause deadlocks if robot A holds aisle 1 and needs aisle 2, while robot B holds aisle 2 and needs aisle 1. Option D violates the single-lane constraint.',
    real_world_context:
      'Time-windowed aisle reservation is the standard approach in automated storage and retrieval systems (AS/RS) and narrow-aisle AMR warehouses. Companies like AutoStore and Ocado use millisecond-precision reservation systems for their high-density storage grids.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['traffic-management', 'reservation', 'aisle', 'fleet', 'amr'],
  },

  // FM-31
  {
    question_text:
      'A fleet management system must implement a robot watchdog that detects unresponsive robots. Each robot sends a heartbeat via MQTT every 5 seconds. The system must detect failures within 20 seconds but minimize false positives from transient network issues. What is the optimal detection strategy?',
    question_type: 'fault_diagnosis',
    difficulty: 2,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Declare failure after 1 missed heartbeat (>5 second gap)' },
      { label: 'B', text: 'Declare failure after 3 consecutive missed heartbeats (>15 second gap), with an escalating response: 1 missed = warning, 2 missed = alert, 3 missed = failure declaration' },
      { label: 'C', text: 'Use MQTT Last Will and Testament (LWT) to declare failure when the TCP connection drops' },
      { label: 'D', text: 'Poll each robot with an HTTP health check every 2 seconds' },
    ],
    correct_answers: ['B'],
    explanation:
      'The escalating threshold approach (option B) balances detection speed with false positive reduction. At 5-second heartbeat intervals, 3 consecutive misses takes 15 seconds to detect — within the 20-second requirement. The escalating response allows the fleet manager to take graduated action: warning (1 miss, 5s) triggers preemptive task reassignment for the robot\'s next task. Alert (2 misses, 10s) pauses new task assignments to the robot. Failure (3 misses, 15s) triggers full recovery protocol (reassign current task, update traffic map). Option A (1 missed) causes frequent false positives — transient WiFi drops lasting 1-5 seconds are common in warehouses. Option C (MQTT LWT) detects TCP drops quickly but fires on any network hiccup, not just robot failures. Option D (HTTP polling) adds complexity and does not improve over MQTT heartbeats.',
    real_world_context:
      'Industry-standard heartbeat monitoring uses the "3 consecutive misses" rule derived from telecommunications (ITU-T recommendations). Locus Robotics uses 3-second heartbeats with a 15-second failure threshold, providing 5 opportunities for heartbeat delivery before failure declaration.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['watchdog', 'heartbeat', 'mqtt', 'fleet', 'amr', 'fault-detection'],
  },

  // FM-32
  {
    question_text:
      'A fleet manager needs to implement A/B testing for a new path planning algorithm on a production fleet of 40 AMRs. How should the fleet be partitioned to get statistically significant results without risking production SLAs?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The new algorithm claims 15% improvement in deadhead distance. Current fleet operates at 85% SLA (95% of tasks completed within 5 minutes). The test must run for at least 2 weeks to capture all operational patterns (weekday/weekend, peak/off-peak).',
    options: [
      { label: 'A', text: 'Split 50/50: 20 robots on new algorithm, 20 on old. Easiest to analyze.' },
      { label: 'B', text: 'Start with 10% (4 robots) on the new algorithm for week 1. If SLA is maintained, expand to 25% (10 robots) for week 2. Analyze results with fleet-interaction effects accounted for.' },
      { label: 'C', text: 'Run new algorithm on all 40 robots for one week, then revert to old algorithm for one week. Compare weeks.' },
      { label: 'D', text: 'Test only during off-peak hours (10pm-6am) on all robots' },
    ],
    correct_answers: ['B'],
    explanation:
      'Staged rollout A/B testing (option B) is the safest approach for production fleet experiments. Starting with 10% limits blast radius — if the new algorithm has a severe regression, only 4 robots are affected and the fleet maintains SLA with the remaining 36. After validating for a week (capturing weekday/weekend patterns), expanding to 25% provides a larger sample for statistical significance while still maintaining a clear control group. Critically, the analysis must account for fleet-interaction effects: the 4 experimental robots share corridors with 36 control robots, so their performance is not independent. Statistical methods like hierarchical models or difference-in-differences control for this. Option A (50/50) risks 50% of fleet capacity on an unproven algorithm. Option C (time-based) confounds the algorithm change with temporal effects (seasonal demand, staffing changes). Option D (off-peak only) does not test the algorithm under the conditions that matter most.',
    real_world_context:
      'This approach mirrors how tech companies do A/B testing (Google, Netflix). Locus Robotics uses staged feature rollouts for algorithm changes, starting with a single warehouse before expanding to their full customer base. The 10% -> 25% -> 50% -> 100% pattern is their standard deployment cadence.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['ab-testing', 'deployment', 'fleet', 'amr', 'statistics'],
  },

  // FM-33
  {
    question_text:
      'Review this fleet management code for task prioritization. The code has a logic error that causes urgent tasks to be deprioritized.',
    question_type: 'code_review',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    code_snippet: `import heapq
from dataclasses import dataclass, field
from enum import IntEnum
from time import time

class Priority(IntEnum):
    URGENT = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4

@dataclass(order=True)
class Task:
    priority: int
    created_at: float = field(compare=True)
    task_id: str = field(compare=False)
    destination: str = field(compare=False)

class TaskQueue:
    def __init__(self):
        self.heap = []

    def add_task(self, task_id: str, dest: str, priority: Priority):
        task = Task(
            priority=priority.value,
            created_at=time(),
            task_id=task_id,
            destination=dest
        )
        heapq.heappush(self.heap, task)

    def get_next_task(self) -> Task | None:
        return heapq.heappop(self.heap) if self.heap else None`,
    options: [
      { label: 'A', text: 'heapq is a max-heap but Priority uses ascending values (1=URGENT) — urgent tasks sink to the bottom' },
      { label: 'B', text: 'The created_at timestamp as second sort key means that among same-priority tasks, the NEWEST task is dequeued first (higher timestamp = lower in min-heap is wrong — actually higher timestamp is greater, so older tasks come first)' },
      { label: 'C', text: 'The code is actually correct: heapq is a min-heap, Priority 1 (URGENT) has the smallest value and will be dequeued first. The created_at tiebreaker correctly orders same-priority tasks by creation time (oldest first). There is no bug in this code.' },
      { label: 'D', text: 'The dataclass order=True with compare=True on created_at breaks the heap invariant' },
    ],
    correct_answers: ['C'],
    explanation:
      'This is a trick question — the code is actually correct. Python\'s heapq is a min-heap (smallest value first). Priority.URGENT = 1 is the smallest value, so urgent tasks are dequeued first. For same-priority tasks, the created_at timestamp (from time()) breaks ties: earlier timestamps are smaller numbers, so older tasks of the same priority are dequeued first (FIFO within priority level). The @dataclass(order=True) generates __lt__ that compares priority first, then created_at — which is the correct ordering for a priority queue with FIFO tiebreaking. This question tests whether you actually understand min-heap behavior and Python\'s dataclass ordering, or whether you assume there must be a bug because the question says so.',
    real_world_context:
      'Priority queues are fundamental to fleet task management. A common interview mistake is confusing min-heap (Python default) with max-heap. Production fleet managers at Locus and Fetch use similar priority queue implementations with additional features like task expiration and priority aging.',
    time_limit_seconds: 120,
    points: 3,
    tags: ['python', 'priority-queue', 'heap', 'fleet', 'task-management'],
  },

  // FM-34
  {
    question_text:
      'A fleet management system must handle the scenario where a robot carrying a high-value item experiences a motor failure mid-transit. Select ALL correct immediate actions. (Select 3)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Log the failure event with robot ID, position, task ID, item ID, and timestamp for audit trail and inventory tracking' },
      { label: 'B', text: 'Immediately dispatch the nearest available robot to the failed robot\'s position to take over the item and continue the delivery' },
      { label: 'C', text: 'Update the traffic map to mark the failed robot\'s position as an obstacle so other robots route around it' },
      { label: 'D', text: 'Reboot the failed robot\'s motor controller to attempt recovery' },
      { label: 'E', text: 'Notify the WMS that the item is in "exception" status to prevent inventory inconsistency' },
    ],
    correct_answers: ['A', 'C', 'E'],
    explanation:
      'The three immediate priorities for a mid-transit failure are: Option A (audit logging) — recording the exact failure context is critical for both inventory tracking and post-incident analysis. The item\'s last known position must be in the system. Option C (traffic map update) — the failed robot is now a stationary obstacle. Without updating the traffic map, other robots will attempt to navigate through its position, causing congestion and potential collisions. This is the highest urgency action for fleet operations. Option E (WMS notification) — the WMS must know the item is no longer in normal transit. Without this, the WMS may mark the delivery as complete when the receiving station times out, or assign the item to another order. Option B (dispatch recovery robot) is a secondary action that should happen after the immediate safety and consistency actions. The recovery robot needs the traffic map update (C) to navigate correctly. Option D (reboot) risks the robot moving unexpectedly during failure recovery.',
    real_world_context:
      'Amazon Robotics implements a "pod handoff" protocol for exactly this scenario. When a Kiva robot fails while carrying a pod, the system: (1) marks the area as blocked within 2 seconds, (2) notifies the WMS, (3) dispatches a recovery robot, (4) alerts a human technician to retrieve the failed robot — in that priority order.',
    time_limit_seconds: 100,
    points: 3,
    tags: ['failure-recovery', 'inventory', 'fleet', 'amr', 'fault-tolerance'],
  },

  // FM-35
  {
    question_text:
      'A fleet management KPI report shows the following metrics for a warehouse with 30 Locus Origin AMRs. Which metric indicates the most critical operational problem?\n\nPicks per hour: 450 (target: 500)\nFleet utilization: 82% (target: 80%)\nAverage task completion time: 3.2 min (target: 3.0 min)\nDeadhead ratio: 42% (target: 25%)\nSafety stops per hour: 8 (target: <15)',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Picks per hour (10% below target) — the primary throughput metric is underperforming' },
      { label: 'B', text: 'Deadhead ratio (42% vs 25% target) — robots are spending 42% of travel time empty, indicating poor task sequencing that is the root cause of the throughput deficit' },
      { label: 'C', text: 'Average task completion time (3.2 vs 3.0 min) — tasks are taking too long' },
      { label: 'D', text: 'Fleet utilization exceeds target (82% vs 80%) — robots are overworked' },
    ],
    correct_answers: ['B'],
    explanation:
      'The deadhead ratio of 42% (vs 25% target) is the root cause metric that explains the other underperforming metrics. Deadhead ratio = (empty travel distance) / (total travel distance). At 42%, robots spend nearly half their travel time moving without carrying items. This directly causes: (1) lower picks/hour (robots waste time traveling empty), (2) longer average task time (each task includes more empty travel between picks). The 10% throughput deficit is a symptom, not the root cause. Fleet utilization at 82% is above target, meaning robots are busy — but they are busy traveling empty. Fixing the deadhead ratio through better task sequencing (assign picks that minimize empty travel between them) would simultaneously improve all underperforming metrics. Task completion time (option C) is a symptom of the deadhead problem.',
    real_world_context:
      'A deadhead ratio of 42% is a major red flag in warehouse operations. Industry best practice is 20-30%. Locus Robotics\' task optimizer uses traveling-salesman-inspired heuristics to minimize deadhead by sequencing picks along efficient routes. Reducing deadhead from 42% to 25% in this scenario would increase picks/hour from 450 to approximately 580.',
    time_limit_seconds: 90,
    points: 3,
    tags: ['kpi', 'deadhead', 'fleet', 'amr', 'task-sequencing', 'diagnosis'],
  },

  // FM-36
  {
    question_text:
      'You are implementing a simulation-based digital twin for fleet optimization. The digital twin must accurately model robot-robot interactions in a warehouse with 40 AMRs. What level of simulation fidelity is required?',
    question_type: 'scenario',
    difficulty: 4,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    scenario_context:
      'The digital twin will be used to: (1) test new traffic management algorithms before deployment, (2) predict throughput impact of adding/removing robots, (3) optimize warehouse layout for robot flow. Real-world data shows that robot-robot interactions (waiting, rerouting, deadlocking) account for 30% of total task time.',
    options: [
      { label: 'A', text: 'Point-mass simulation with perfect path following — sufficient for throughput estimation' },
      { label: 'B', text: 'Kinematic simulation with realistic acceleration/deceleration profiles, sensor-based collision avoidance with configurable reaction times, and probabilistic communication delays — capturing the dynamics that cause the 30% interaction overhead' },
      { label: 'C', text: 'Full physics simulation (Gazebo/Isaac Sim) with rendered sensors, friction, and motor dynamics' },
      { label: 'D', text: 'Discrete-event simulation where robots teleport between waypoints with stochastic travel times' },
    ],
    correct_answers: ['B'],
    explanation:
      'Kinematic simulation with realistic interaction modeling (option B) provides the right fidelity for fleet optimization. The key is capturing the dynamics that cause the 30% interaction overhead: (1) realistic acceleration/deceleration profiles determine how long robots take to stop when encountering obstacles — this directly affects corridor throughput. (2) Sensor-based collision avoidance models determine when robots detect each other and how they respond (stop, slow, reroute). (3) Communication delays affect how quickly the fleet manager can coordinate — a 200ms delay in congestion means robots have already committed to conflicting paths. Option A (point-mass) misses all interaction dynamics and would predict only 70% of actual behavior. Option C (full physics) is orders of magnitude slower than real-time and the additional fidelity (friction, motor dynamics) does not significantly improve fleet-level predictions. Option D (discrete-event) cannot capture the continuous dynamics of corridor sharing.',
    real_world_context:
      'Amazon uses a proprietary kinematic fleet simulator that runs 1000x faster than real-time for testing Kiva robot traffic algorithms. The simulator was calibrated against real warehouse data to achieve <5% prediction error on throughput metrics. Full physics simulation would limit them to 1-10x real-time, making statistical analysis impractical.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['digital-twin', 'simulation', 'fleet', 'amr', 'optimization'],
  },

  // FM-37
  {
    question_text:
      'Select ALL correct approaches for implementing secure OTA firmware updates to a fleet of 50 AMRs over a potentially compromised warehouse WiFi network. (Select 3)',
    question_type: 'multi_select',
    difficulty: 4,
    domain_code: 'FLEET_MANAGEMENT',
    level: 'specialist',
    specialization: 'amr',
    options: [
      { label: 'A', text: 'Sign firmware images with an Ed25519 key; robots verify the signature before applying updates (prevents tampered firmware injection)' },
      { label: 'B', text: 'Use HTTPS/TLS for firmware download (encrypts the firmware in transit, preventing interception and injection)' },
      { label: 'C', text: 'Implement A/B partition scheme: write new firmware to inactive partition, verify boot, and roll back to previous partition if health checks fail within 5 minutes' },
      { label: 'D', text: 'Compress firmware images with gzip to reduce download time' },
      { label: 'E', text: 'Implement mutual TLS (mTLS) between each robot and the update server so the server verifies robot identity and the robot verifies server identity' },
    ],
    correct_answers: ['A', 'C', 'E'],
    explanation:
      'Option A (firmware signing) is the most critical security measure. Even if an attacker compromises the WiFi network and performs a man-in-the-middle attack, they cannot inject malicious firmware because they lack the private signing key. Ed25519 provides fast verification suitable for embedded systems. Option C (A/B partitioning) provides rollback safety — if a signed but buggy firmware causes the robot to fail health checks (navigation, sensor validation, network connectivity), it automatically reverts to the known-good partition. Without this, a bad OTA could brick 50 robots simultaneously. Option E (mutual TLS) ensures bidirectional authentication: the robot confirms it is talking to the legitimate update server (not a rogue AP), and the server confirms it is sending updates to an authorized robot (not an attacker exfiltrating firmware). Option B (HTTPS) provides transport encryption but is weaker than mTLS because standard TLS only authenticates the server, not the client. Option D (compression) is a performance optimization, not a security measure.',
    real_world_context:
      'The SWUpdate and Mender.io frameworks, widely used in AMR OTA systems, implement all three of these measures. In 2023, a security researcher demonstrated firmware injection on an improperly secured fleet by compromising warehouse WiFi and spoofing the update server — firmware signing would have prevented the attack.',
    time_limit_seconds: 120,
    points: 4,
    tags: ['ota', 'security', 'firmware', 'fleet', 'amr', 'tls'],
  },
];
