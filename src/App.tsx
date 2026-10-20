import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/primitives/Layout';
import { TrainHome } from './screens/TrainHome';
import { SessionBuilder } from './screens/SessionBuilder';
import { ActiveSession } from './screens/ActiveSession';
import { SessionComplete } from './screens/SessionComplete';
import { YouScreen } from './screens/YouScreen';
import { LogDetail } from './screens/LogDetail';
import { SettingsScreen } from './screens/SettingsScreen';
import { MindHome } from './screens/MindHome';
import { MindBreathe } from './screens/MindBreathe';
import { MindPause } from './screens/MindPause';
import { MindCheckIn } from './screens/MindCheckIn';
import { EatHome } from './screens/EatHome';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/train" replace />} />
          
          {/* Train space */}
          <Route path="train" element={<TrainHome />} />
          <Route path="train/build" element={<SessionBuilder />} />
          <Route path="train/active" element={<ActiveSession />} />
          <Route path="train/complete" element={<SessionComplete />} />

          {/* You space */}
          <Route path="you" element={<YouScreen />} />
          <Route path="you/log/:id" element={<LogDetail />} />
          <Route path="you/settings" element={<SettingsScreen />} />

          {/* Mind space */}
          <Route path="mind" element={<MindHome />} />
          <Route path="mind/breathe" element={<MindBreathe />} />
          <Route path="mind/pause" element={<MindPause />} />
          <Route path="mind/check-in" element={<MindCheckIn />} />

          {/* Eat space */}
          <Route path="eat" element={<EatHome />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/train" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
